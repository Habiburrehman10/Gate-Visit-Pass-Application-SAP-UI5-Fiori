sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("gatepass.gatepass.controller.App", {
            onInit: function () {

                sap.ui.getCore().applyTheme('sap_belize_plus');

            var sFaviconPath = sap.ui.require.toUrl("gatepass/gatepass/Images/TMCLogo_favicon.png");
            this.getView().byId("app").setHomeIcon({
                'phone': sFaviconPath,
                'tablet': sFaviconPath,
                'icon': sFaviconPath
            });

            }
        });
    });
