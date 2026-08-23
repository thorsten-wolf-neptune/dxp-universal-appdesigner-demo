import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace com.imported.neptune_flight
 */
export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    // Avoid empty init() that only calls super — babel-preset-transform-ui5
    // + Babel 8 turns that into an invalid identifier. Parent init still runs.
}
