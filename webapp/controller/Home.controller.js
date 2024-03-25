sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "gatepass/gatepass/utils/datamanager_vp"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel, datamanager) {
        "use strict";

        return Controller.extend("gatepass.gatepass.controller.Home", {


            loc: {
                latitude: '',
                longitude: '',
                plant: ''
            },

            onInit: function () {
                var oView = this.getView();
                var that = this;
                var plant ='';

                var sImagePath = sap.ui.require.toUrl("gatepass/gatepass/Images/TMCLogo_favicon.png");
                this.getView().byId("HomeImage").setSrc(sImagePath);
            
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;
                    var Plant ;
                    
            
                    datamanager.getLoc(function (response) {
                        debugger;
                        that.loc = JSON.parse(response.EvJson);
                        console.log(that.loc);
            
                        var oModelPost = new JSONModel(that.loc);
                        that.getView().setModel(oModelPost, "locData");
            
                        var data = that.getView().getModel("locData").getData();
            
                        // Example coordinates
                        const myLatitude = lat;
                        const myLongitude = lon;
            
                        // Iterate over each location in the data array
                        data.forEach(function (location) {
                            debugger;
                            const targetLatitude = location.LATITUDE; // Assuming property names
                            const targetLongitude = location.LONGITUDE; // Assuming property names
            
                            // Calculate the distance between current and target location
                            const distance = that.calculateDistance(myLatitude, myLongitude, targetLatitude, targetLongitude);
            
                            // Check if the distance is within a certain range (e.g., 10 kilometers)
                            const range = 1; // Range in kilometers
                            if (distance <= range) {
                                console.log("The target location is within the range of " + range + " kilometers.");
                                console.log("Plant Number: " + location.PLANT); 
                                // if(location.PLANT === '01'){
                                //     that.getView().byId('vpBtn').setEnabled(false);
                                //     Plant = '1';
                                // }else if (location.PLANT === '02'){
                                //     that.getView().byId('gpBtn').setEnabled(false);
                                //     Plant = '2';
                                // }
                            } else {
                                console.log("The target location is outside the range.");
                            }
                            that.plant = Plant;
                        });
                    });
                }, function (error) {
                    console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                });
            },
            
            calculateDistance: function (lat1, lon1, lat2, lon2) {
                debugger;
                const R = 6371; // Radius of the Earth in kilometers
                const dLat = this.toRadians(lat2 - lat1);
                const dLon = this.toRadians(lon2 - lon1);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c; // Distance in kilometers
                return distance;
            },
            
            toRadians: function (degrees) {
                return degrees * (Math.PI / 180);
            },
            








            onGPPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Master");
            },
            onVSPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Visitor");
            },
            onDRGPress: function () {
                debugger;
                // this.plant='2';
                // if(this.plant === '1'){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("GPReport");
                // }
                // else if(this.plant === '2'){
                //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("VPReport");
                // }
                
            },

            onDRVPress : function(){
                debugger;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("VPReport");

            }
        });
    });