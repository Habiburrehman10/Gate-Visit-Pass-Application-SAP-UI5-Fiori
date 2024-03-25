/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "gatepass/gatepass/model/models",
        "sap/ui/model/odata/ODataModel",
        "gatepass/gatepass/utils/datamanager",
         "gatepass/gatepass/utils/datamanager_vp"
    ],
    function (UIComponent, Device, models,ODataModel, datamanager,datamanager_vp) {
        "use strict";

        return UIComponent.extend("gatepass.gatepass.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);


                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                   //call datamanger loader
                   var sUrl = "/sap/opu/odata/sap/ZGATEPASS_SRV/";
                   var oModel = new ODataModel(sUrl, true);
                   sap.ui.getCore().setModel(oModel);
                   datamanager.init(oModel);
                   datamanager_vp.init(oModel);
            }
        });
    }
);