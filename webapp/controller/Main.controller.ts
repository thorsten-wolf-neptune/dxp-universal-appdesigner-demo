import Controller from "sap/ui/core/mvc/Controller";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import type UIComponent from "sap/ui/core/UIComponent";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import { initData, dataStore } from "../model/initData";
import { createApplModelHandle } from "../model/dxpData";
import type Bar from "sap/m/Bar";
import type Button from "sap/m/Button";
import type Column from "sap/m/Column";
import type ColumnListItem from "sap/m/ColumnListItem";
import type DynamicSideContent from "sap/ui/layout/DynamicSideContent";
import type IconTabBar from "sap/m/IconTabBar";
import type IconTabFilter from "sap/m/IconTabFilter";
import type Image from "sap/m/Image";
import type Label from "sap/m/Label";
import type List from "sap/m/List";
import type MessageBox from "sap/m/MessageBox";
import type MessagePage from "sap/m/MessagePage";
import type MessageStrip from "sap/m/MessageStrip";
import type ObjectAttribute from "sap/m/ObjectAttribute";
import type ObjectHeader from "sap/m/ObjectHeader";
import type ObjectListItem from "sap/m/ObjectListItem";
import type ObjectNumber from "sap/m/ObjectNumber";
import type ObjectStatus from "sap/m/ObjectStatus";
import type OverflowToolbar from "sap/m/OverflowToolbar";
import type OverflowToolbarButton from "sap/m/OverflowToolbarButton";
import type Page from "sap/m/Page";
import type PullToRefresh from "sap/m/PullToRefresh";
import type SearchField from "sap/m/SearchField";
import type Select from "sap/m/Select";
import type SimpleForm from "sap/ui/layout/form/SimpleForm";
import type SplitApp from "sap/m/SplitApp";
import type Table from "sap/m/Table";
import type Text from "sap/m/Text";
import type Title from "sap/m/Title";
import type Toolbar from "sap/m/Toolbar";
import type ToolbarLayoutData from "sap/m/ToolbarLayoutData";
import type ToolbarSpacer from "sap/m/ToolbarSpacer";
import type ViewSettingsDialog from "sap/m/ViewSettingsDialog";
import type ViewSettingsFilterItem from "sap/m/ViewSettingsFilterItem";
import { getOnlineMasterList, getOnlineDetail, getOnlineSelectAUART } from "../model/services";

interface AppScope {
    oApp: SplitApp;
    oPageMaster: Page;
    pullUpdate: PullToRefresh;
    headerMaster: Bar;
    txtTitleMaster: Title;
    toolMasterSearch: Toolbar;
    inFilterMaster: SearchField;
    toolMasterFlight: Toolbar;
    selectAUART: Select;
    ToolbarLayoutData: ToolbarLayoutData;
    MasterList: List;
    MasterListToolbar: Toolbar;
    MasterListText: Text;
    MasterListInfoSetting: ViewSettingsDialog;
    MasterListFilterPrice: ViewSettingsFilterItem;
    MasterItem: ObjectListItem;
    footerMaster: Bar;
    butMasterUpdate: Button;
    butMasterOptions: Button;
    oPageDetail: Page;
    headerDetail: Bar;
    butBackDetail: Button;
    txtTitleDetail: Title;
    logoDetail: Image;
    pageHeaderDetail: ObjectHeader;
    oHeaderDepartDate: ObjectAttribute;
    oHeaderDepartTime: ObjectAttribute;
    oHeaderArrivalDate: ObjectStatus;
    oHeaderArrivalTime: ObjectStatus;
    oMessageStrip: MessageStrip;
    barDetail: IconTabBar;
    barDetailInfo: IconTabFilter;
    oDynamicSideContent: DynamicSideContent;
    formAvailability: SimpleForm;
    lblAvailFirst: Label;
    txtAvailFirst: Text;
    lblAvailBusiness: Label;
    txtAvailBusiness: Text;
    lblAvailEconomy: Label;
    txtAvailEconomy: Text;
    formAdditionalInfo: SimpleForm;
    lblDistance: Label;
    txtDistance: Text;
    lblPlaneType: Label;
    txtPlaneType: Text;
    barDetailBookings: IconTabFilter;
    oOverflowToolbar: OverflowToolbar;
    oToolbarSpacer: ToolbarSpacer;
    inFilterPassenger: SearchField;
    oOverflowToolbarButton: OverflowToolbarButton;
    tabBooking: Table;
    coltabBookingCARRID: Column;
    coltabBookingCONNID: Column;
    coltabBookingORDER_DATE: Column;
    coltabBookingPASSNAME: Column;
    coltabBookingLUGGWEIGHT: Column;
    coltabBookingLOCCURAM: Column;
    coltabBookingCUSTTYPE: Column;
    coltabBookingSMOKER: Column;
    coltabBookingCLASS: Column;
    coltabBookingCANCELLED: Column;
    colItemtabBooking: ColumnListItem;
    txttabBookingCARRID: Text;
    txttabBookingCONNID: Text;
    txttabBookingORDER_DATE: Text;
    txttabBookingPASSNAME: Text;
    txttabBookingLUGGWEIGHT: ObjectNumber;
    txttabBookingLOCCURAM: ObjectNumber;
    txttabBookingCUSTTYPE: Text;
    txttabBookingSMOKER: Text;
    txttabBookingCLASS: Text;
    txttabBookingCANCELLED: Text;
    footerDetail: Bar;
    oPageMessage: Page;
    oMessage: MessagePage;
    footerMessage: Bar;
    oPageHidden: Page;
    oMessageGenData: MessageBox;
    txtTranslateHeader: Text;
    txtTranslateUpdated: Text;
    txtTranslateUnit: Text;
    txtTranslateSeatsAvail: Text;
    txtTranslateNoEconAvail: Text;
    txtTranslateNoBusiAvail: Text;
    txtTranslateNoFirstAvail: Text;
    coltabBookingCARRID_lbl: Label;
    coltabBookingCONNID_lbl: Label;
    coltabBookingORDER_DATE_lbl: Label;
    coltabBookingPASSNAME_lbl: Label;
    coltabBookingLUGGWEIGHT_lbl: Label;
    coltabBookingLOCCURAM_lbl: Label;
    coltabBookingCUSTTYPE_lbl: Label;
    coltabBookingSMOKER_lbl: Label;
    coltabBookingCLASS_lbl: Label;
    coltabBookingCANCELLED_lbl: Label;
    modelMasterList: ReturnType<typeof createApplModelHandle>;
    modeloPageDetail: ReturnType<typeof createApplModelHandle>;
    modelformAdditionalInfo: ReturnType<typeof createApplModelHandle>;
    modelformAvailability: ReturnType<typeof createApplModelHandle>;
    modeltabBooking: ReturnType<typeof createApplModelHandle>;
    modelselectAUART: ReturnType<typeof createApplModelHandle>;
    getOnlineMasterList: typeof getOnlineMasterList;
    getOnlineDetail: typeof getOnlineDetail;
    getOnlineSelectAUART: typeof getOnlineSelectAUART;
    setHeaderText: () => void;
    filterMasterList: () => void;
    selectFirstItem: () => void;
    afterDataLoadedAjax: () => void;
    onBackButtonCustom: () => void;
    onOfflineCustom: () => void;
    onOnlineCustom: () => void;
    onPauseCustom: () => void;
    onResumeCustom: () => void;
    bGrouped: boolean;
}

/**
 * Migrated from Neptune sap edition. Event bodies keep the original
 * identifier scope via {@link AppScope}; `this` inside the IIFE is the event source.
 *
 * JSONModels are registered on the Component (named + default), not per control.
 *
 * @namespace com.imported.neptune_flight.controller
 */
export default class Main extends Controller {
    private scope!: AppScope;

    public onInit(): void {
        this.scope = this.buildScope();
        Object.assign(this.scope, this.bindNamedFunctions());
        this.attachTransportLifecycle();
        const { oMessageStrip, inFilterMaster, pullUpdate } = this.scope;
        // Globals
        this.scope.bGrouped = false;
        
        oMessageStrip.setVisible(false);
        
        // InitLoad
        if (sap.n) {
            sap.n.Shell.attachInit(function(data, navObj) { // App launch
                console.log("Flight Launchpad Init...");
            });
        
            sap.n.Shell.attachBeforeDisplay(function(data, navObj) { // App display
                console.log("Flight Launchpad BeforeDisplay...");
            });
        
        } else {
            console.log("Flight Standalone Init...");
        
                inFilterMaster.rerender();
                    pullUpdate.setVisible(sap.ui.Device.support.touch);
        
                    dataStore.onSettled(function() {
                        sap.ui.core.BusyIndicator.hide();
                    });
        }
        this.noAppCache();
        void initData(this.getOwnerComponent() as UIComponent);
    }

    private attachTransportLifecycle(): void {
        dataStore.onSettled((id, result) => {
            BusyIndicator.hide();
            if (!result.ok) {
                if (id === "GET_FLIGHTS") this.onMasterListAjaxError();
                if (id === "GET_FLIGHT_DETAIL") this.onDetailAjaxError();
                return;
            }
            if (id === "GET_FLIGHTS") this.onMasterListAjaxSuccess();
            if (id === "GET_FLIGHT_DETAIL") this.onDetailAjaxSuccess();
        });
    }

    private buildScope(): AppScope {
        const oApp = this.byId("oApp") as SplitApp;
        const oPageMaster = this.byId("oPageMaster") as Page;
        const pullUpdate = this.byId("pullUpdate") as PullToRefresh;
        const headerMaster = this.byId("headerMaster") as Bar;
        const txtTitleMaster = this.byId("txtTitleMaster") as Title;
        const toolMasterSearch = this.byId("toolMasterSearch") as Toolbar;
        const inFilterMaster = this.byId("inFilterMaster") as SearchField;
        const toolMasterFlight = this.byId("toolMasterFlight") as Toolbar;
        const selectAUART = this.byId("selectAUART") as Select;
        const ToolbarLayoutData = this.byId("ToolbarLayoutData") as ToolbarLayoutData;
        const MasterList = this.byId("MasterList") as List;
        const MasterListToolbar = this.byId("MasterListToolbar") as Toolbar;
        const MasterListText = this.byId("MasterListText") as Text;
        const MasterListInfoSetting = this.byId("MasterListInfoSetting") as ViewSettingsDialog;
        const MasterListFilterPrice = this.byId("MasterListFilterPrice") as ViewSettingsFilterItem;
        const MasterItem = this.byId("MasterItem") as ObjectListItem;
        const footerMaster = this.byId("footerMaster") as Bar;
        const butMasterUpdate = this.byId("butMasterUpdate") as Button;
        const butMasterOptions = this.byId("butMasterOptions") as Button;
        const oPageDetail = this.byId("oPageDetail") as Page;
        const headerDetail = this.byId("headerDetail") as Bar;
        const butBackDetail = this.byId("butBackDetail") as Button;
        const txtTitleDetail = this.byId("txtTitleDetail") as Title;
        const logoDetail = this.byId("logoDetail") as Image;
        const pageHeaderDetail = this.byId("pageHeaderDetail") as ObjectHeader;
        const oHeaderDepartDate = this.byId("oHeaderDepartDate") as ObjectAttribute;
        const oHeaderDepartTime = this.byId("oHeaderDepartTime") as ObjectAttribute;
        const oHeaderArrivalDate = this.byId("oHeaderArrivalDate") as ObjectStatus;
        const oHeaderArrivalTime = this.byId("oHeaderArrivalTime") as ObjectStatus;
        const oMessageStrip = this.byId("oMessageStrip") as MessageStrip;
        const barDetail = this.byId("barDetail") as IconTabBar;
        const barDetailInfo = this.byId("barDetailInfo") as IconTabFilter;
        const oDynamicSideContent = this.byId("oDynamicSideContent") as DynamicSideContent;
        const formAvailability = this.byId("formAvailability") as SimpleForm;
        const lblAvailFirst = this.byId("lblAvailFirst") as Label;
        const txtAvailFirst = this.byId("txtAvailFirst") as Text;
        const lblAvailBusiness = this.byId("lblAvailBusiness") as Label;
        const txtAvailBusiness = this.byId("txtAvailBusiness") as Text;
        const lblAvailEconomy = this.byId("lblAvailEconomy") as Label;
        const txtAvailEconomy = this.byId("txtAvailEconomy") as Text;
        const formAdditionalInfo = this.byId("formAdditionalInfo") as SimpleForm;
        const lblDistance = this.byId("lblDistance") as Label;
        const txtDistance = this.byId("txtDistance") as Text;
        const lblPlaneType = this.byId("lblPlaneType") as Label;
        const txtPlaneType = this.byId("txtPlaneType") as Text;
        const barDetailBookings = this.byId("barDetailBookings") as IconTabFilter;
        const oOverflowToolbar = this.byId("oOverflowToolbar") as OverflowToolbar;
        const oToolbarSpacer = this.byId("oToolbarSpacer") as ToolbarSpacer;
        const inFilterPassenger = this.byId("inFilterPassenger") as SearchField;
        const oOverflowToolbarButton = this.byId("oOverflowToolbarButton") as OverflowToolbarButton;
        const tabBooking = this.byId("tabBooking") as Table;
        const coltabBookingCARRID = this.byId("coltabBookingCARRID") as Column;
        const coltabBookingCONNID = this.byId("coltabBookingCONNID") as Column;
        const coltabBookingORDER_DATE = this.byId("coltabBookingORDER_DATE") as Column;
        const coltabBookingPASSNAME = this.byId("coltabBookingPASSNAME") as Column;
        const coltabBookingLUGGWEIGHT = this.byId("coltabBookingLUGGWEIGHT") as Column;
        const coltabBookingLOCCURAM = this.byId("coltabBookingLOCCURAM") as Column;
        const coltabBookingCUSTTYPE = this.byId("coltabBookingCUSTTYPE") as Column;
        const coltabBookingSMOKER = this.byId("coltabBookingSMOKER") as Column;
        const coltabBookingCLASS = this.byId("coltabBookingCLASS") as Column;
        const coltabBookingCANCELLED = this.byId("coltabBookingCANCELLED") as Column;
        const colItemtabBooking = this.byId("colItemtabBooking") as ColumnListItem;
        const txttabBookingCARRID = this.byId("txttabBookingCARRID") as Text;
        const txttabBookingCONNID = this.byId("txttabBookingCONNID") as Text;
        const txttabBookingORDER_DATE = this.byId("txttabBookingORDER_DATE") as Text;
        const txttabBookingPASSNAME = this.byId("txttabBookingPASSNAME") as Text;
        const txttabBookingLUGGWEIGHT = this.byId("txttabBookingLUGGWEIGHT") as ObjectNumber;
        const txttabBookingLOCCURAM = this.byId("txttabBookingLOCCURAM") as ObjectNumber;
        const txttabBookingCUSTTYPE = this.byId("txttabBookingCUSTTYPE") as Text;
        const txttabBookingSMOKER = this.byId("txttabBookingSMOKER") as Text;
        const txttabBookingCLASS = this.byId("txttabBookingCLASS") as Text;
        const txttabBookingCANCELLED = this.byId("txttabBookingCANCELLED") as Text;
        const footerDetail = this.byId("footerDetail") as Bar;
        const oPageMessage = this.byId("oPageMessage") as Page;
        const oMessage = this.byId("oMessage") as MessagePage;
        const footerMessage = this.byId("footerMessage") as Bar;
        const oPageHidden = this.byId("oPageHidden") as Page;
        const oMessageGenData = this.byId("oMessageGenData") as MessageBox;
        const txtTranslateHeader = this.byId("txtTranslateHeader") as Text;
        const txtTranslateUpdated = this.byId("txtTranslateUpdated") as Text;
        const txtTranslateUnit = this.byId("txtTranslateUnit") as Text;
        const txtTranslateSeatsAvail = this.byId("txtTranslateSeatsAvail") as Text;
        const txtTranslateNoEconAvail = this.byId("txtTranslateNoEconAvail") as Text;
        const txtTranslateNoBusiAvail = this.byId("txtTranslateNoBusiAvail") as Text;
        const txtTranslateNoFirstAvail = this.byId("txtTranslateNoFirstAvail") as Text;
        const coltabBookingCARRID_lbl = this.byId("coltabBookingCARRID_lbl") as Label;
        const coltabBookingCONNID_lbl = this.byId("coltabBookingCONNID_lbl") as Label;
        const coltabBookingORDER_DATE_lbl = this.byId("coltabBookingORDER_DATE_lbl") as Label;
        const coltabBookingPASSNAME_lbl = this.byId("coltabBookingPASSNAME_lbl") as Label;
        const coltabBookingLUGGWEIGHT_lbl = this.byId("coltabBookingLUGGWEIGHT_lbl") as Label;
        const coltabBookingLOCCURAM_lbl = this.byId("coltabBookingLOCCURAM_lbl") as Label;
        const coltabBookingCUSTTYPE_lbl = this.byId("coltabBookingCUSTTYPE_lbl") as Label;
        const coltabBookingSMOKER_lbl = this.byId("coltabBookingSMOKER_lbl") as Label;
        const coltabBookingCLASS_lbl = this.byId("coltabBookingCLASS_lbl") as Label;
        const coltabBookingCANCELLED_lbl = this.byId("coltabBookingCANCELLED_lbl") as Label;
        const modelMasterList = createApplModelHandle(this.getOwnerComponent() as UIComponent, "IT_FLIGHTS");
        const modeloPageDetail = createApplModelHandle(this.getOwnerComponent() as UIComponent, "WA_FLIGHT_DETAIL");
        const modelformAdditionalInfo = createApplModelHandle(this.getOwnerComponent() as UIComponent, "WA_ADDITIONAL_INFO");
        const modelformAvailability = createApplModelHandle(this.getOwnerComponent() as UIComponent, "WA_AVAILABILITY");
        const modeltabBooking = createApplModelHandle(this.getOwnerComponent() as UIComponent, "IT_SBOOK");
        const modelselectAUART = createApplModelHandle(this.getOwnerComponent() as UIComponent, "selectAUART");
        return { oApp, oPageMaster, pullUpdate, headerMaster, txtTitleMaster, toolMasterSearch, inFilterMaster, toolMasterFlight, selectAUART, ToolbarLayoutData, MasterList, MasterListToolbar, MasterListText, MasterListInfoSetting, MasterListFilterPrice, MasterItem, footerMaster, butMasterUpdate, butMasterOptions, oPageDetail, headerDetail, butBackDetail, txtTitleDetail, logoDetail, pageHeaderDetail, oHeaderDepartDate, oHeaderDepartTime, oHeaderArrivalDate, oHeaderArrivalTime, oMessageStrip, barDetail, barDetailInfo, oDynamicSideContent, formAvailability, lblAvailFirst, txtAvailFirst, lblAvailBusiness, txtAvailBusiness, lblAvailEconomy, txtAvailEconomy, formAdditionalInfo, lblDistance, txtDistance, lblPlaneType, txtPlaneType, barDetailBookings, oOverflowToolbar, oToolbarSpacer, inFilterPassenger, oOverflowToolbarButton, tabBooking, coltabBookingCARRID, coltabBookingCONNID, coltabBookingORDER_DATE, coltabBookingPASSNAME, coltabBookingLUGGWEIGHT, coltabBookingLOCCURAM, coltabBookingCUSTTYPE, coltabBookingSMOKER, coltabBookingCLASS, coltabBookingCANCELLED, colItemtabBooking, txttabBookingCARRID, txttabBookingCONNID, txttabBookingORDER_DATE, txttabBookingPASSNAME, txttabBookingLUGGWEIGHT, txttabBookingLOCCURAM, txttabBookingCUSTTYPE, txttabBookingSMOKER, txttabBookingCLASS, txttabBookingCANCELLED, footerDetail, oPageMessage, oMessage, footerMessage, oPageHidden, oMessageGenData, txtTranslateHeader, txtTranslateUpdated, txtTranslateUnit, txtTranslateSeatsAvail, txtTranslateNoEconAvail, txtTranslateNoBusiAvail, txtTranslateNoFirstAvail, coltabBookingCARRID_lbl, coltabBookingCONNID_lbl, coltabBookingORDER_DATE_lbl, coltabBookingPASSNAME_lbl, coltabBookingLUGGWEIGHT_lbl, coltabBookingLOCCURAM_lbl, coltabBookingCUSTTYPE_lbl, coltabBookingSMOKER_lbl, coltabBookingCLASS_lbl, coltabBookingCANCELLED_lbl, modelMasterList, modeloPageDetail, modelformAdditionalInfo, modelformAvailability, modeltabBooking, modelselectAUART, getOnlineMasterList, getOnlineDetail, getOnlineSelectAUART, bGrouped: false } as AppScope;
    }

    private bindNamedFunctions(): Pick<AppScope, "setHeaderText" | "filterMasterList" | "selectFirstItem" | "afterDataLoadedAjax" | "onBackButtonCustom" | "onOfflineCustom" | "onOnlineCustom" | "onPauseCustom" | "onResumeCustom"> {
        const { modelMasterList, txtTitleMaster, txtTranslateHeader, MasterList, selectAUART, inFilterMaster, oApp, oPageMessage, MasterListToolbar, pullUpdate, txtTranslateUpdated, oPageMaster } = this.scope;
        function setHeaderText() {
            if (typeof modelMasterList.oData.length !== 'undefined') {
                txtTitleMaster.setText(txtTranslateHeader.getText() + " (" + modelMasterList.oData.length + ")");
            } else {
                txtTitleMaster.setText(txtTranslateHeader.getText());
            }
        }

        function filterMasterList() {
            const binding = MasterList.getBinding("items");

            const selectedAUART = selectAUART.getSelectedKey() || "";
            const filterValue = inFilterMaster.getValue() || "";

            const filters = [];
            filters.push(new sap.ui.model.Filter("INTRO", "Contains", filterValue));

            if (selectedAUART !== '') {
                filters.push(new sap.ui.model.Filter("AIRLINEID", "EQ", selectedAUART));
            } else {
                filters.push(new sap.ui.model.Filter("AIRLINEID", "NE", ''));
            }
            binding.filter(filters);

            var item_qty = binding.getLength();

            //Update Header Counter Text
            txtTitleMaster.setText(txtTranslateHeader.getText() + " (" + item_qty + ")");

            //If no items, show Message page
            if (item_qty === 0) {
                oApp.toDetail(oPageMessage);
            } else {
                selectFirstItem();
            }
        }

        function selectFirstItem() {

            // Not for phone
            if (sap.ui.Device.system.phone) {
                return;
            }

            // Not when grouping is active
            if (MasterListToolbar.getVisible()) {
                return;
            }

            var items = MasterList.getItems();
            MasterList.removeSelections();

            if (items.length > 0) {
                MasterList.setSelectedItem(items[0]);
                MasterList.fireItemPress();
            }
                    else if (MasterList.getBinding && MasterList.getBinding("items")) {
                        MasterList.attachEventOnce("updateFinished", function () {
                            var later = MasterList.getItems();
                            if (later.length > 0) {
                                MasterList.setSelectedItem(later[0]);
                                MasterList.fireItemPress();
                            }
                        });
                    }
        }

        function afterDataLoadedAjax() {

            sap.ui.core.BusyIndicator.hide();

            pullUpdate.hide();
            jQuery.sap.require("sap.m.MessageToast");
            sap.m.MessageToast.show(txtTranslateUpdated.getText());

            setHeaderText();

            if (modelMasterList.oData.length === 0){
               OpenoMessageGenData();

            } else{
               selectFirstItem();
            }
        }

        // Back button handler
        function onBackButtonCustom() {

            if (sap.ui.Device.system.phone) {

                switch (oApp.getCurrentPage().getId()) {

                    case "oPageMaster":
                        AppCache.Back();
                        break;

                    default:
                        oApp.backDetail();
                }
            } else {
                AppCache.Back();
            }

        }

        // Going offline event
        function onOfflineCustom() {

        }

        // Going online event
        function onOnlineCustom() {

        }

        // On pause event
        function onPauseCustom() {

        }

        // On resume event
        function onResumeCustom() {

        }
        return { setHeaderText, filterMasterList, selectFirstItem, afterDataLoadedAjax, onBackButtonCustom, onOfflineCustom, onOnlineCustom, onPauseCustom, onResumeCustom };
    }

    public onPullUpdateRefresh(oEvent: Event): void {
        const { getOnlineMasterList } = this.scope;
        (function (this: Control) {
            getOnlineMasterList();
        }).call(oEvent.getSource() as Control);
    }

    public onInFilterMasterLiveChange(oEvent: Event): void {
        const { MasterList, filterMasterList } = this.scope;
        (function (this: Control) {
            // var binding = MasterList.getBinding("items");
            // var filter = new sap.ui.model.Filter("INTRO", "Contains", this.getValue());
            // binding.filter([filter]);

            filterMasterList();
        }).call(oEvent.getSource() as Control);
    }

    public onSelectAUARTChange(oEvent: Event): void {
        const { MasterList, txtTitleMaster, txtTranslateHeader, oApp, oPageMessage, selectFirstItem, filterMasterList } = this.scope;
        (function (this: Control) {
            // // Filter List by Airline Id
            // var binding = MasterList.getBinding("items");

            // if (modelMasterForm.oData.CARR_ID !== '') {
            //     var filter = new sap.ui.model.Filter("AIRLINEID", "EQ", modelMasterForm.oData.CARR_ID);
            // } else {
            //     var filter = new sap.ui.model.Filter("AIRLINEID", "NE", '');
            // }
            // binding.filter([filter]);

            // var item_qty = binding.getLength();

            // //Update Header Counter Text
            // txtTitleMaster.setText(txtTranslateHeader.getText() + " (" + item_qty + ")");

            // //If no items, show Message page
            // if (item_qty === 0) {
            //     oApp.toDetail(oPageMessage);
            // } else {
            //     selectFirstItem();
            // }

            filterMasterList();
        }).call(oEvent.getSource() as Control);
    }

    public onMasterListAjaxError(): void {
        sap.ui.core.BusyIndicator.hide();
    }

    public onMasterListAjaxSuccess(): void {
        const { afterDataLoadedAjax } = this.scope;
        afterDataLoadedAjax();
    }

    public onMasterListItemPress(oEvent: Event): void {
        const { MasterList, modeloPageDetail, getOnlineDetail, oApp, oPageDetail } = this.scope;
        (function (this: Control) {
            // Get Selected Row of MasterList
            var selectedItem = this.getSelectedItem();
            var context = selectedItem.getBindingContext("IT_FLIGHTS");

            // Get key value
            var key = context.getProperty("KEY");

            modeloPageDetail.setData(context.getObject());

            sap.ui.core.BusyIndicator.show();
            getOnlineDetail(key);
            oApp.toDetail(oPageDetail);  // Navigate
        }).call(oEvent.getSource() as Control);
    }

    public onMasterListInfoSettingConfirm(oEvent: Event): void {
        const { MasterList, MasterListToolbar, MasterListText } = this.scope;
        (function (this: Control) {
            // Replace yourTable with the correct Table name
            var mParams = oEvent.getParameters();
            var oBinding = MasterList.getBinding("items");
            var aSorters = [];
            var infoText = "";
            var filterText = "";

            // Sort with Grouping
            if (mParams.groupItem) {
                var sPath = mParams.groupItem.getKey();
                var bDescending = mParams.groupDescending;
                aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, true));
                infoText = "Group by: (" + mParams.groupItem.getText() + ")";
            }

            // Sorting
            if (mParams.sortItem) {
                var sPath = mParams.sortItem.getKey();
                var bDescending = mParams.sortDescending;
                aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, false));

                infoText = infoText + " Sort by: (" + mParams.sortItem.getText() + ")";
            }

            // Filter
            // Attribute Key should consist of FieldName__Operator__ValueLow__ValueHigh
            var aFilters = [];
            $.each(mParams.filterItems, function(i, oItem) {
                var aSplit = oItem.getKey().split("__");
                var sPath = aSplit[0];
                var sOperator = aSplit[1];
                var sValue1 = aSplit[2];
                var sValue2 = aSplit[3];
                var oFilter = new sap.ui.model.Filter(sPath, sOperator, sValue1, sValue2);
                filterText = filterText + oItem.getText();
                aFilters.push(oFilter);
            });

            // Apply Sorting/Grouping/Filter
            oBinding.sort(aSorters);
            oBinding.filter(aFilters);

            // Apply InfoText
            if (filterText) {
                infoText = infoText + " Filter by: (" + filterText + ")";
            }

            if (infoText) {
                MasterListToolbar.setVisible(true);
                MasterListText.setText(infoText);
            } else {
                MasterListToolbar.setVisible(false);
            }
        }).call(oEvent.getSource() as Control);
    }

    public onButMasterUpdatePress(oEvent: Event): void {
        const { getOnlineMasterList } = this.scope;
        (function (this: Control) {
            sap.ui.core.BusyIndicator.show();
            getOnlineMasterList();
        }).call(oEvent.getSource() as Control);
    }

    public onButMasterOptionsPress(oEvent: Event): void {
        const { MasterListInfoSetting } = this.scope;
        (function (this: Control) {
            MasterListInfoSetting.open();
        }).call(oEvent.getSource() as Control);
    }

    public onOPageDetailAjaxSuccess(): void {
        const { oApp } = this.scope;
        oApp.toDetail();
    }

    public onButBackDetailPress(oEvent: Event): void {
        const { oApp } = this.scope;
        (function (this: Control) {
            oApp.backDetail();
        }).call(oEvent.getSource() as Control);
    }

    public onInFilterPassengerLiveChange(oEvent: Event): void {
        const { tabBooking } = this.scope;
        (function (this: Control) {
            var binding = tabBooking.getBinding("items");
            var filter = new sap.ui.model.Filter("PASSNAME", "Contains", this.getValue());
            binding.filter([filter]);
        }).call(oEvent.getSource() as Control);
    }

    public onOOverflowToolbarButtonPress(oEvent: Event): void {
        const { tabBooking } = this.scope;
        const scope = this.scope;
        (function (this: Control) {
            // Group by Booking Date
            var oSorter = new sap.ui.model.Sorter("ORDER_DATE", false, !scope.bGrouped);
            var binding = tabBooking.getBinding("items");
            binding.sort(oSorter);
            scope.bGrouped = !scope.bGrouped;
        }).call(oEvent.getSource() as Control);
    }

    public onDetailAjaxError(): void {
        const { oMessageStrip } = this.scope;
        sap.ui.core.BusyIndicator.hide();
        oMessageStrip.setVisible(true);
    }

    public onDetailAjaxSuccess(): void {
        const { barDetailBookings, modeltabBooking, modelformAvailability, oMessageStrip, txtTranslateNoEconAvail, txtTranslateNoBusiAvail, txtTranslateNoFirstAvail, txtTranslateSeatsAvail } = this.scope;
        // Set tab counter
        barDetailBookings.setCount(modeltabBooking.oData.length);

        if (modelformAvailability.oData.ECONOFREE === 0) {
            oMessageStrip.setType("Error");
            oMessageStrip.setText(txtTranslateNoEconAvail.getText());
        } else if (modelformAvailability.oData.BUSINFREE === 0) {
            oMessageStrip.setType("Warning");
            oMessageStrip.setText(txtTranslateNoBusiAvail.getText());
        } else if (modelformAvailability.oData.FIRSTFREE === 0) {
            oMessageStrip.setType("Warning");
            oMessageStrip.setText(txtTranslateNoFirstAvail.getText());
        } else {
            oMessageStrip.setType("Success");
            oMessageStrip.setText(txtTranslateSeatsAvail.getText());
        }

        oMessageStrip.setVisible(true);
        sap.ui.core.BusyIndicator.hide();
    }

    public noAppCache(): void {
        // if (typeof AppCache === "undefined") {
        //     butBackMaster.setVisible(false);
        // }
    }
}
