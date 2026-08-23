export type LoadStrategy = "cache" | "online" | "onlineOnEmptyCache";
export type Persistence = "none" | "indexeddb" | "localstorage";

export interface StoreTransport {
    kind: "json-get" | "neptune-ajax" | "openapi";
    eventId?: string;
    applid?: string;
    fieldId?: string;
    receiveKey?: string;
    receiveAliases?: Record<string, string>;
    sendKeys?: Array<{ payloadKey: string; path: string }>;
    operationId?: string;
    method?: string;
}

export interface StoreSpec {
    id: string;
    kind: "json" | "rest" | "static" | "odata";
    role?: "model" | "transport";
    filledBy?: string;
    initLoad?: boolean;
    uri?: string;
    shape?: unknown;
    binding?: "native" | "json";
    load: LoadStrategy;
    persistence: Persistence;
    adapterId?: string;
    protocol?: string;
    transport?: StoreTransport;
    mergeInto?: string;
}

export interface InvokeRequest {
    init?: RequestInit;
    path?: string;
    pathParams?: Record<string, string | number>;
    ajaxValue?: string;
}

export interface InvokeResult {
    ok: boolean;
    status: number;
    data: unknown;
}

export interface DataStore {
    ids(): string[];
    load(id: string): Promise<unknown>;
    invoke(id: string, req?: InvokeRequest): Promise<InvokeResult>;
    save(id: string, data: unknown): Promise<void>;
    clear(id: string): Promise<void>;
    data(id: string): unknown;
    getSpec(id: string): StoreSpec | undefined;
    onSettled(fn: (id: string, result: { ok: boolean }) => void): () => void;
}

export function resolveDataUrl(uri: string, proxy?: string): string {
    const prefix = proxy ?? (globalThis as { __DXP_DATA_PROXY__?: string }).__DXP_DATA_PROXY__;
    if (!uri || !prefix) return uri;
    if (!/^https?:\/\//i.test(uri)) return uri;
    try {
        const u = new URL(uri);
        return prefix.replace(/\/$/, "") + "/" + u.protocol.replace(":", "") + "/" + u.host + u.pathname + u.search;
    } catch {
        return uri;
    }
}

function storageKey(appId: string, storeId: string): string {
    return "dxp-data:" + appId + ":" + storeId;
}

function cacheUsable(cached: unknown, spec: StoreSpec): boolean {
    if (cached === undefined || isEmptyData(cached)) return false;
    const key = spec.transport && spec.transport.receiveKey;
    if (!key) return true;
    if (!cached || typeof cached !== "object" || Array.isArray(cached)) return true;
    const value = (cached as Record<string, unknown>)[key];
    return value !== undefined && !isEmptyData(value);
}

export function isEmptyData(data: unknown): boolean {
    if (data === null || data === undefined) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data === "object") {
        const values = Object.values(data as object);
        if (values.length === 0) return true;
        return values.every((v) => isEmptyData(v));
    }
    return false;
}

async function persistRead(persistence: Persistence, appId: string, storeId: string): Promise<unknown | undefined> {
    if (persistence === "none") return undefined;
    if (persistence === "indexeddb" && globalThis.indexedDB) {
        try {
            const value = await idbOp("get", storageKey(appId, storeId));
            if (value !== undefined) return value;
        } catch { /* LocalStorage fallback */ }
    }
    try {
        const raw = globalThis.localStorage?.getItem(storageKey(appId, storeId));
        return raw == null ? undefined : JSON.parse(raw);
    } catch {
        return undefined;
    }
}

async function persistWrite(persistence: Persistence, appId: string, storeId: string, data: unknown): Promise<void> {
    if (persistence === "none") return;
    if (persistence === "indexeddb" && globalThis.indexedDB) {
        try {
            await idbOp("put", storageKey(appId, storeId), data);
            return;
        } catch { /* LocalStorage fallback */ }
    }
    try {
        globalThis.localStorage?.setItem(storageKey(appId, storeId), JSON.stringify(data));
    } catch { /* quota */ }
}

async function persistClear(persistence: Persistence, appId: string, storeId: string): Promise<void> {
    if (persistence === "none") return;
    if (persistence === "indexeddb" && globalThis.indexedDB) {
        try { await idbOp("delete", storageKey(appId, storeId)); } catch { /* ignore */ }
    }
    try { globalThis.localStorage?.removeItem(storageKey(appId, storeId)); } catch { /* ignore */ }
}

function idbOp(op: "get" | "put" | "delete", key: string, value?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const req = globalThis.indexedDB.open("dxp-data", 1);
        req.onupgradeneeded = () => {
            if (!req.result.objectStoreNames.contains("models")) req.result.createObjectStore("models");
        };
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
            const db = req.result;
            const tx = db.transaction("models", op === "get" ? "readonly" : "readwrite");
            const store = tx.objectStore("models");
            const r = op === "get" ? store.get(key) : op === "put" ? store.put(value, key) : store.delete(key);
            r.onsuccess = () => resolve(r.result);
            r.onerror = () => reject(r.error);
        };
    });
}

function decodeJsonhTable(values: unknown): Record<string, unknown>[] {
    if (!Array.isArray(values) || values.length === 0) return [];
    const width = Number(values[0]);
    if (!Number.isInteger(width) || width < 1) return [];
    const names = values.slice(1, 1 + width).map((n) => String(n ?? ""));
    const rows: Record<string, unknown>[] = [];
    for (let i = 1 + width; i + width - 1 < values.length; i += width) {
        const row: Record<string, unknown> = {};
        for (let c = 0; c < width; c++) row[names[c] || ("c" + c)] = values[i + c];
        rows.push(row);
    }
    return rows;
}

function applName(rawName: string, aliases?: Record<string, string>): string {
    return (aliases && aliases[rawName]) || rawName;
}
function collapseJsonh(name: string, rows: Record<string, unknown>[]): unknown {
    if (rows.length === 1 && /^(WA_|MS_)/i.test(name)) return rows[0];
    return rows;
}
function unpackJsonhPayload(body: unknown, receiveKey?: string, aliases?: Record<string, string>): unknown {
    const rec = body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : undefined;
    if (!rec) return body;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rec)) {
        const m = /^model(.+)Data$/.exec(key);
        const rawName = m ? m[1] : key;
        if (Array.isArray(value) && Number.isInteger(Number(value[0]))) {
            const dest = applName(rawName, aliases);
            out[dest] = collapseJsonh(dest, decodeJsonhTable(value));
            continue;
        }
        if (m && Array.isArray(value)) {
            out[applName(rawName, aliases)] = value;
            continue;
        }
        out[applName(rawName, aliases)] = value;
    }
    if (receiveKey && !(receiveKey in out)) {
        const packed = rec["model" + receiveKey + "Data"] ?? rec[receiveKey];
        if (Array.isArray(packed) && Number.isInteger(Number(packed[0]))) out[receiveKey] = collapseJsonh(receiveKey, decodeJsonhTable(packed));
        else if (Array.isArray(packed)) out[receiveKey] = packed;
    }
    return out;
}

async function readJsonBody(res: Response): Promise<unknown> {
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("json")) {
        try { return await res.json(); } catch { return undefined; }
    }
    const text = await res.text();
    if (!text) return undefined;
    try { return JSON.parse(text); } catch { return text; }
}

function transportKindOf(spec: StoreSpec): StoreTransport["kind"] {
    if (spec.transport?.kind) return spec.transport.kind;
    if (spec.adapterId === "neptune-sap-edition-ajax") return "neptune-ajax";
    if (spec.adapterId === "openapi" || spec.protocol === "openapi") return "openapi";
    return "json-get";
}

function withAjaxValue(uri: string, value?: string): string {
    const trimmed = value && value.trim();
    if (!trimmed) return uri;
    const sep = uri.includes("?") ? (uri.endsWith("&") || uri.endsWith("?") ? "" : "&") : "?";
    return uri + sep + "ajax_value=" + encodeURIComponent(trimmed);
}

async function invokeSpec(spec: StoreSpec, fetchImpl: typeof fetch, req?: InvokeRequest): Promise<InvokeResult> {
    if (!spec.uri) return { ok: false, status: 0, data: undefined };
    const kind = transportKindOf(spec);
    const method = (req?.init?.method ?? spec.transport?.method ?? (kind === "neptune-ajax" ? "POST" : "GET")).toString().toUpperCase();
    const headers: Record<string, string> = kind === "neptune-ajax"
        ? { Accept: "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }
        : { Accept: "application/json" };
    const res = await fetchImpl(resolveDataUrl(kind === "neptune-ajax" ? withAjaxValue(spec.uri, req && req.ajaxValue) : spec.uri), {
        ...req?.init,
        method,
        headers: { ...headers, ...(req?.init?.headers ?? {}) },
        body: req?.init?.body ?? (method === "GET" ? undefined : kind === "neptune-ajax" ? "{}" : req?.init?.body)
    });
    const raw = await readJsonBody(res);
    const data = kind === "neptune-ajax" ? unpackJsonhPayload(raw, spec.transport?.receiveKey, spec.transport?.receiveAliases) : raw;
    return { ok: res.ok, status: res.status, data };
}

export function createStore(opts: { appId: string; stores: StoreSpec[]; fetchImpl?: typeof fetch; onUpdate?: (id: string, data: unknown) => void; getSendPayload?: (id: string) => Record<string, unknown> | undefined }): DataStore {
    const byId = new Map(opts.stores.map((s) => [s.id, s] as const));
    const memory = new Map<string, unknown>();
    const settled: Array<(id: string, result: { ok: boolean }) => void> = [];
    const fetchImpl = opts.fetchImpl ?? (typeof fetch === "function" ? fetch.bind(globalThis) : undefined);
    const notifySettled = (id: string, ok: boolean): void => {
        for (const fn of settled) fn(id, { ok });
    };

    async function fetchUri(spec: StoreSpec): Promise<unknown | undefined> {
        if (!spec.uri || !fetchImpl) return undefined;
        try {
            const result = await invokeSpec(spec, fetchImpl);
            return result.ok ? result.data : undefined;
        } catch {
            return undefined;
        }
    }

    async function distribute(data: unknown): Promise<void> {
        const rec = asRecord(data);
        if (!rec) return;
        for (const key of Object.keys(rec)) {
            const target = byId.get(key);
            if (!target || target.role === "transport") continue;
            memory.set(key, rec[key]);
            await persistWrite(target.persistence, opts.appId, key, rec[key]);
            if (opts.onUpdate) opts.onUpdate(key, rec[key]);
        }
    }

    return {
        ids: () => [...byId.keys()],
        getSpec: (id) => byId.get(id),
        data: (id) => (memory.has(id) ? memory.get(id) : byId.get(id)?.shape),
        onSettled(fn) {
            settled.push(fn);
            return () => {
                const i = settled.indexOf(fn);
                if (i >= 0) settled.splice(i, 1);
            };
        },
        async invoke(id, req) {
            const spec = byId.get(id);
            if (!spec || !fetchImpl) {
                notifySettled(id, false);
                return { ok: false, status: 0, data: undefined };
            }
            try {
                let next = req;
                if (spec.transport && spec.transport.kind === "neptune-ajax" && !(req && req.init && req.init.body != null)) {
                    const payload = opts.getSendPayload ? opts.getSendPayload(id) : {};
                    next = { ...req, init: { ...(req && req.init), body: JSON.stringify(payload || {}) } };
                }
                const result = await invokeSpec(spec, fetchImpl, next);
                if (result.ok) {
                    memory.set(id, result.data);
                    await persistWrite(spec.persistence, opts.appId, id, result.data);
                    if (spec.role === "transport") await distribute(result.data);
                    opts.onUpdate?.(id, result.data);
                }
                notifySettled(id, result.ok);
                return result;
            } catch {
                notifySettled(id, false);
                return { ok: false, status: 0, data: undefined };
            }
        },
        async load(id) {
            const spec = byId.get(id);
            if (!spec) return undefined;
            if (spec.kind === "odata" && spec.binding !== "json") return spec.shape;
            const cached = await persistRead(spec.persistence, opts.appId, id);
            const shape = spec.shape ?? {};
            if (spec.role !== "transport" && spec.filledBy && (cached === undefined || isEmptyData(cached))) {
                await this.load(spec.filledBy);
                return memory.has(id) ? memory.get(id) : shape;
            }
            if (spec.load === "cache") {
                const data = cached !== undefined && !isEmptyData(cached) ? cached : shape;
                memory.set(id, data);
                if (spec.role === "transport") notifySettled(id, true);
                return data;
            }
            if (spec.load === "online") {
                const remote = await fetchUri(spec);
                const data = remote !== undefined ? remote : (cached !== undefined ? cached : shape);
                memory.set(id, data);
                if (remote !== undefined) {
                    await persistWrite(spec.persistence, opts.appId, id, data);
                    if (spec.role === "transport") await distribute(data);
                }
                if (spec.role === "transport") notifySettled(id, remote !== undefined);
                return data;
            }
            if (cacheUsable(cached, spec)) {
                memory.set(id, cached);
                if (spec.role === "transport") await distribute(cached);
                if (spec.role === "transport") notifySettled(id, true);
                return cached;
            }
            const remote = await fetchUri(spec);
            const data = remote !== undefined ? remote : shape;
            memory.set(id, data);
            if (remote !== undefined) {
                await persistWrite(spec.persistence, opts.appId, id, data);
                if (spec.role === "transport") await distribute(data);
            }
            if (spec.role === "transport") notifySettled(id, remote !== undefined);
            return data;
        },
        async save(id, data) {
            memory.set(id, data);
            const spec = byId.get(id);
            if (spec) await persistWrite(spec.persistence, opts.appId, id, data);
        },
        async clear(id) {
            memory.delete(id);
            const spec = byId.get(id);
            if (spec) await persistClear(spec.persistence, opts.appId, id);
        }
    };
}

export type QueryOperator = "EQ" | "NE" | "GT" | "GE" | "LT" | "LE" | "Contains";

function compare(left: unknown, right: unknown, op: QueryOperator): boolean {
    if (op === "Contains") return String(left ?? "").includes(String(right ?? ""));
    if (op === "EQ") return left === right;
    if (op === "NE") return left !== right;
    if (op === "GT") return (left as number) > (right as number);
    if (op === "GE") return (left as number) >= (right as number);
    if (op === "LT") return (left as number) < (right as number);
    return (left as number) <= (right as number);
}

export function query<T extends Record<string, unknown>>(source: unknown) {
    const data = (Array.isArray(source) ? source : []).slice() as T[];
    const match = (row: T, filter: Partial<T>, operators?: QueryOperator | QueryOperator[]) => {
        const keys = Object.keys(filter) as (keyof T)[];
        if (!keys.length) return true;
        const ops = Array.isArray(operators) ? operators : keys.map(() => (typeof operators === "string" ? operators : "EQ"));
        return keys.every((key, i) => compare(row[key], filter[key], ops[i] ?? "EQ"));
    };
    return {
        data,
        find: (filter: Partial<T>, operators?: QueryOperator | QueryOperator[]) => data.filter((row) => match(row, filter, operators)),
        findFirst: (filter: Partial<T>, operators?: QueryOperator | QueryOperator[]) => data.find((row) => match(row, filter, operators)),
        add: (row: T) => { data.push(row); },
        update: (filter: Partial<T>, patch: Partial<T>, operators?: QueryOperator | QueryOperator[]) => {
            for (const row of data) if (match(row, filter, operators)) Object.assign(row, patch);
        },
        delete: (filter: Partial<T>, operators?: QueryOperator | QueryOperator[]) => {
            for (let i = data.length - 1; i >= 0; i--) if (match(data[i]!, filter, operators)) data.splice(i, 1);
        }
    };
}

export function getTypedJsonModel<T = unknown>(
    component: { getModel(name?: string): { setData(data: T): void } | undefined },
    name?: string
): { setData(data: T): void; getData?(): T; getProperty?(path: string): unknown } | undefined {
    const model = name ? component.getModel(name) : component.getModel();
    return model && typeof model.setData === "function" ? model : undefined;
}

export function fillJsonModel(component: { getModel(name?: string): { setData(data: unknown): void; getData?(): unknown } | undefined }, name: string, data: unknown): void {
    const model = getTypedJsonModel(component, name);
    model?.setData(data);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

export function mergeJsonModel(component: { getModel(name?: string): { setData(data: unknown): void; getData?(): unknown } | undefined }, name: string, data: unknown): void {
    const model = getTypedJsonModel(component, name);
    if (!model) return;
    const incoming = asRecord(data);
    if (!incoming) {
        model.setData(data);
        return;
    }
    const prev = asRecord(model.getData?.()) ?? {};
    model.setData({ ...prev, ...incoming });
}

export function applyStoreData(component: { getModel(name?: string): { setData(data: unknown): void; getData?(): unknown } | undefined }, spec: StoreSpec | undefined, id: string, data: unknown): void {
    if (spec && spec.role === "transport") {
        const rec = asRecord(data);
        if (rec) {
            for (const key of Object.keys(rec)) fillJsonModel(component, key, rec[key]);
        }
        return;
    }
    const target = spec?.mergeInto !== undefined ? spec.mergeInto : id;
    if (target !== id) {
        mergeJsonModel(component, target, data);
        return;
    }
    fillJsonModel(component, target, data);
}

function shouldInitLoadTransport(spec: StoreSpec | undefined): boolean {
    if (!spec) return false;
    if (spec.role !== "transport" && !spec.transport) return false;
    if (spec.initLoad === false) return false;
    if (spec.initLoad === true) return true;
    if (spec.transport && spec.transport.kind === "neptune-ajax") return Boolean(spec.transport.receiveKey);
    return true;
}

export async function fillComponentModels(component: { getModel(name?: string): { setData(data: unknown): void; getData?(): unknown } | undefined }, store: DataStore): Promise<void> {
    for (const id of store.ids()) {
        const spec = store.getSpec(id);
        if (spec && spec.kind === "odata" && spec.binding !== "json") continue;
        if (spec && (spec.role === "transport" || spec.transport)) {
            if (!shouldInitLoadTransport(spec)) continue;
            await store.load(id);
        }
    }
    for (const id of store.ids()) {
        const spec = store.getSpec(id);
        if (spec && spec.role === "transport") continue;
        if (spec && spec.kind === "odata" && spec.binding !== "json") continue;
        const current = component.getModel(id);
        const existing = current && current.getData ? current.getData() : undefined;
        if (!isEmptyData(existing)) continue;
        const next = store.data(id);
        if (isEmptyData(next)) continue;
        fillJsonModel(component, id, next);
    }
}

export function createApplModelHandle(component: { getModel(name?: string): { setData(data: unknown): void; getData?(): unknown; refresh?(force?: boolean): void } | undefined }, modelName: string): { setData(data: unknown): void; getData(): unknown; readonly oData: unknown } {
    const name = String(modelName || "").replace(/^\//, "");
    const read = () => {
        const model = component.getModel(name);
        return model && model.getData ? model.getData() : undefined;
    };
    const write = (data: unknown) => {
        const model = component.getModel(name);
        if (!model) return;
        model.setData(data);
        if (model.refresh) model.refresh(true);
    };
    return {
        setData: write,
        getData: read,
        get oData() { return read(); }
    };
}

export function registerAppServiceWorker(spec: { enabled?: boolean } | undefined, scriptUrl = "offline/sw.js"): void {
    if (!spec?.enabled || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const path = typeof location !== "undefined" ? location.pathname : "";
    if (path.includes("/__preview__/") || path.includes("/flp-sandbox/")) return;
    if ((globalThis as { __DXP_FLP_CFG__?: unknown }).__DXP_FLP_CFG__ != null) return;
    void navigator.serviceWorker.register(scriptUrl).catch(() => { /* preview */ });
}
