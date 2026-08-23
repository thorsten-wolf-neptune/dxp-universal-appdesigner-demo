import { dataStore } from "./initData";

export async function getOnlineMasterList(value?: string | RequestInit, init?: RequestInit): Promise<unknown> {
    const req = typeof value === "string" || value === undefined
        ? { ajaxValue: typeof value === "string" ? value : undefined, init }
        : { init: value };
    const result = await dataStore.invoke("GET_FLIGHTS", req);
    if (!result.ok) throw new Error("GET_FLIGHTS" + " failed: " + result.status);
    return result.data;
}

export async function getOnlineDetail(value?: string | RequestInit, init?: RequestInit): Promise<unknown> {
    const req = typeof value === "string" || value === undefined
        ? { ajaxValue: typeof value === "string" ? value : undefined, init }
        : { init: value };
    const result = await dataStore.invoke("GET_FLIGHT_DETAIL", req);
    if (!result.ok) throw new Error("GET_FLIGHT_DETAIL" + " failed: " + result.status);
    return result.data;
}

export async function getOnlineSelectAUART(value?: string | RequestInit, init?: RequestInit): Promise<unknown> {
    const req = typeof value === "string" || value === undefined
        ? { ajaxValue: typeof value === "string" ? value : undefined, init }
        : { init: value };
    const result = await dataStore.invoke("INIT_selectAUART", req);
    if (!result.ok) throw new Error("" + " failed: " + result.status);
    return result.data;
}
