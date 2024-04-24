sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "gatepass/gatepass/utils/datamanager",
    "gatepass/gatepass/utils/formatter",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Filter, FilterOperator, datamanager, formatter, MessageToast, ValueState) {
        "use strict";

        return Controller.extend("gatepass.gatepass.controller.Master", {

            formate: formatter,

            searchResponse: {
                data: []
            },

            // adobeForm: {
            //     ev_base64: ""
            // },

            f4Help: {
                arrF4Data: [],
                custData: [],
                suppData: [],
                matData: []
            },

            lineItem: {
                ITEMS: []
            },

            objPostData: {
                GP_NO: "",
                CITYOFFICE: false,
                RETURNABLE: false,
                REF_DOC: "",
                REF_TYPE: " ",
                DRIVER_NAME: "",
                DRIVER_NIC: "",
                DRIVER_CONTACT: "",
                DRIVER_CHALLAN: "",
                VEHICLE_NO: "",
                TRUCK_RECPT_NO: "",
                REASON: "",
                REMARKS: "",
                CUSTOMER: "",
                SUPPLIER: "",
                DELIV_CHALLAN_DATE: "",
                EXP_DELIV_DATE: "",
                GATE_INCHARGE: "",
                MOT: "",
                TRANSPORT: "",
                DEPARTMENT: "",
                DESCRIPTION: "",
                DESTINATION: "",
                EXIT_TIME: "",
                CHECKIN_DATE: "",
                CHECKIN_TIME: "",
                CHECKOUT_DATE: "",
                CHECKOUT_TIME: "",
                GP_Type: "",
                ITEMS: []

            },

            onInit: function () {

                let that = this;

                this.getView().addEventDelegate({
                    onAfterShow: jQuery.proxy(this.showMsgbox, this)
                });




                debugger;
                // sap.m.MessageBox.show("Select Gate Pass Type", {
                //     icon: sap.m.MessageBox.Icon.NONE,
                //     title: "Gate Pass",
                //     // actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.OUTWARD],
                //     actions: ["Inward", "Outward"],
                //     onClose: function (oAction) {
                //         if (oAction === "Inward") {
                //             debugger;
                //             // var oComponent = that.getOwnerComponent();

                //             var sTitle = that.getView().byId("Title1");
                //             var GPType = that.getView().byId("GPType");


                //             sTitle.setProperty("text", "InWard GatePass Selection");
                //             GPType.setValue("Inward");


                //         } else if (oAction === "Outward") {
                //             debugger;

                //             var sTitle = that.getView().byId("Title1");
                //             var GPType = that.getView().byId("GPType");


                //             sTitle.setProperty("text", "OutWard GatePass Selection");
                //             GPType.setValue("Outward");



                //         }
                //     }
                // });



                var sImagePath = sap.ui.require.toUrl("gatepass/gatepass/Images/TMCLogo_favicon.png");
                this.getView().byId("MasterImage").setSrc(sImagePath);

                //set model in view initially with object containing fields
                var oModelPost = new JSONModel(this.objPostData);
                this.getView().setModel(oModelPost, "gpData");

                // datamanager.getF4HelpData(function (response) {

                //     //set response data in global object
                //     that.searchResponse.data = response.results;

                // }, function (error) {
                //     console.log(error);
                // });

                var oTable = this.getView().byId("ItemData");
                oTable.attachDelete(this.onDeleteRow.bind(this));

            },

            showMsgbox : function(){
                var that = this;
                sap.m.MessageBox.show("Select Gate Pass Type", {
                    icon: sap.m.MessageBox.Icon.NONE,
                    title: "Gate Pass",
                    // actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.OUTWARD],
                    actions: ["Inward", "Outward"],
                    onClose: function (oAction) {
                        if (oAction === "Inward") {
                            debugger;
                            // var oComponent = that.getOwnerComponent();

                            var sTitle = that.getView().byId("Title1");
                            var GPType = that.getView().byId("GPType");


                            sTitle.setProperty("text", "InWard GatePass Selection");
                            GPType.setValue("Inward");


                        } else if (oAction === "Outward") {
                            debugger;

                            var sTitle = that.getView().byId("Title1");
                            var GPType = that.getView().byId("GPType");


                            sTitle.setProperty("text", "OutWard GatePass Selection");
                            GPType.setValue("Outward");



                        }
                    }
                });
            },


            onBackPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Home");
            },

            onDeleteRow: function (oEvent) {
                debugger;
                var oTable = this.getView().byId("ItemData");
                var oItem = oEvent.getParameter("listItem");
                var oModel = this.getView().getModel("lineItemModel");
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                this.isEditMode = false;

                if (oModel === undefined) {
                    // Handle the scenario where lineItemModel doesn't exist
                    var oModel = this.getView().getModel("GPDetailsModel");
                    var oContext = oItem.getBindingContext("GPDetailsModel");
                    // if (oGPModel) {
                    //     var data = oGPModel.getData();
                    //     this.getView().setModel(new sap.ui.model.json.JSONModel({ ITEMS: data.ITEMS }), "lineItemModel");

                    //     oModel = this.getView().getModel("lineItemModel");
                    // } else {
                    //     console.error("GPDetailsModel not found");
                    //     return; // Exit the function if GPDetailsModel is not found
                    // }
                } else {
                    var oContext = oItem.getBindingContext("lineItemModel");
                }

                if (oItem && selectedKey === "OT" || oItem && selectedKey === "PO" || oItem && selectedKey === "SHIP" || oItem && selectedKey === "SDC") {
                    // Get the binding context of the item


                    if (oContext) {
                        // Get the path of the item in the model
                        var sPath = oContext.getPath();

                        // Get the index of the item in the array
                        var iIndex = parseInt(sPath.split("/").pop());

                        // Remove the item from the array
                        var aItems = oModel.getProperty("/ITEMS");
                        aItems.splice(iIndex, 1);

                        // Set the modified array back to the model
                        oModel.setProperty("/ITEMS", aItems);

                        MessageToast.show("Row deleted!");
                    }
                } else {
                    MessageToast.show("Not allowed for GatePass Doc");
                }
            },

            hide: false,
            manualTracking: function () {
                debugger;
                if (this.hide === false) {
                    var form = this.getView().byId("FormChangeColumn_oneGroup235");
                    var btnMT = this.getView().byId("manualTracking");


                    form.setVisible(true);
                    btnMT.setText("Hide Manual Tracking");
                    btnMT.setType("Emphasized");
                    this.hide = true;
                } else if (this.hide === true) {
                    var form = this.getView().byId("FormChangeColumn_oneGroup235");
                    var btnMT = this.getView().byId("manualTracking");


                    form.setVisible(false);
                    btnMT.setText("Manual Tracking");
                    btnMT.setType("Default");
                    this.hide = false;
                    this.getView().byId("DATEIN").setValue("");
                    this.getView().byId("TIMEIN").setValue("");
                    this.getView().byId("DATEOUT").setValue("");
                    this.getView().byId("TIMEOUT").setValue("");
                    this.getView().byId("REASON_MT").setValue("");
                }
            },



            onAction: function () {
                debugger;
                this.getView().byId("gatepassNum").setValue("");
                this.getView().byId("chkCityOffice").setSelected(false);
                this.getView().byId("chkReturnable").setSelected(false);
                this.getView().byId("refDocNum").setValue("");
                // this.getView().byId("referencesType").setValue("");
                this.getView().byId("DRIVER_NAME").setValue("");
                this.getView().byId("DRIVER_NIC").setValue("");
                this.getView().byId("DRIVER_CONTACT").setValue("");
                this.getView().byId("DRIVER_CHALLAN").setValue("");
                this.getView().byId("VEHICLE_NO").setValue("");
                this.getView().byId("TRUCK_RECPT_NO").setValue("");
                this.getView().byId("REASON").setValue("");
                this.getView().byId("REMARKS").setValue("");
                this.getView().byId("supplierNumber").setValue("");
                this.getView().byId("customerNumber").setValue("");
                this.getView().byId("DELIV_CHALLAN_DATE").setValue("");
                this.getView().byId("EXP_DELIV_DATE").setValue("");
                this.getView().byId("GATE_INCHARGE").setValue("");
                this.getView().byId("MOT").setValue("");
                this.getView().byId("TRANSPORT").setValue("");
                this.getView().byId("DEPARTMENT").setValue("");
                this.getView().byId("DESCRIPTION").setValue("");
                this.getView().byId("DESTINATION").setValue("");
                this.getView().byId("DTP2").setValue("");
                this.getView().byId("checkInDate").setValue("");
                this.getView().byId("checkInTime").setValue("");
                this.getView().byId("checkOutDate").setValue("");
                this.getView().byId("checkOutTime").setValue("");
                // var oSelect = this.getView().byId("GPType");
                // var oItem = oSelect.getItemByKey("Inward");
                // oSelect.setSelectedItem(oItem);
                this.getView().byId("GPType").setEditable(true);
                this.getView().byId("btnChkOut").setVisible(false);
                this.getView().byId("DATEIN").setValue("");
                this.getView().byId("DATEOUT").setValue("");
                this.getView().byId("TIMEIN").setValue("");
                this.getView().byId("TIMEOUT").setValue("");
                this.getView().byId("REASON_MT").setValue("");
                var form = this.getView().byId("FormChangeColumn_oneGroup235");
                var btnMT = this.getView().byId("manualTracking");

                form.setVisible(false);
                btnMT.setEnabled(true);
                btnMT.setText("Manual Tracking");
                btnMT.setType("Default");
                this.hide = false;
                var oModel = this.getView().getModel('gpData'); // Get the model bound to your view

                oModel.setProperty("/CHECKIN_DATE", "");
                oModel.setProperty("/CHECKIN_TIME", "");
                oModel.refresh();





                // var oModel = this.getView().getModel("lineItemModel");

                // // Clear the data in the model
                // oModel.setProperty("/items", []);

                // // Update the model to reflect the changes
                // oModel.updateBindings();
                var oTable = this.getView().byId("ItemData");

                // Remove all items from the table
                oTable.removeAllItems();

            },
            onCreate: function () {
                this.onAction();
                this.counted = 0;
                this.editable = false;
            },

            zdialog: "",

            _ParentValueHelpSearch: function (oEvent) {

                debugger;
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                var searchQuery = oEvent.getParameter("value");
                if (oEvent.mParameters.id === 'gp') {
                    var data = 'GP_NO';
                    zdialog = this.newGateDialog1;
                } else if (selectedKey === 'PO' && oEvent.mParameters.id != 'sup' && oEvent.mParameters.id != 'cust') {
                    var data = 'EBELN';
                    zdialog = this.newRefdocDialog1;
                } else if (selectedKey === 'SHIP' && oEvent.mParameters.id != 'sup' && oEvent.mParameters.id != 'cust') {
                    var data = 'TKNUM';
                    var zdialog = this.newRefdocDialog2;
                } else if (selectedKey === 'GP' && oEvent.mParameters.id != 'sup' && oEvent.mParameters.id != 'cust') {
                    var data = 'GP_NO';
                    zdialog = this.newRefdocDialog3;
                } else if (oEvent.mParameters.id === 'sup') {
                    var data = 'LIFNR';
                    var data1 = 'NAME1';
                    zdialog = this.newSuppDialog1;
                } else if (oEvent.mParameters.id === 'cust') {
                    var data = 'KUNNR';
                    var data1 = 'NAME1';
                    zdialog = this.newCustDialog1;
                }

                this.zdialog = zdialog;

                if (!searchQuery) {

                    this.clearFilters();
                } else {
                    var filters = [];
                    if (!isNaN(searchQuery)) {
                        filters.push(new Filter(data, FilterOperator.EQ, parseInt(searchQuery)));
                    } else {
                        filters.push(new Filter(data1, FilterOperator.Contains, searchQuery));
                    }

                    var mainFilter = new Filter({ filters: filters, and: false });
                    this.applyFilter(mainFilter, zdialog);
                }
            },

            clearFilters: function () {
                this.applyFilter(null, this.zdialog); // Clear all filters
            },
            that: this,


            applyFilter: function (filter, zdialog) {
                debugger;
                // var that = this;

                var oListBinding = zdialog.getBinding("items");

                if (oListBinding) {
                    oListBinding.filter(filter);

                } else {
                    console.error("List binding not found!");
                }
                // that.newGatePassDialog.getModel().refresh();
                // Open the dialog
                // that.newGatePassDialog.open();
                // }
            },

            onSelectChange: function () {

                debugger;
                this.getView().byId("refDocNum").setValue("");
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                var suppNo = this.getView().byId("supplierNumber");
                if (selectedKey === 'PO') {
                    suppNo.setRequired(true);
                } else {
                    suppNo.setRequired(false);
                }


            },

            onGPSelectChange: function () {

                let selectedKey = this.getView().byId("GPType").getSelectedKey();
                var sTitle = this.getView().byId("Title1");
                if (selectedKey === "Inward") {


                    sTitle.setProperty("text", "InWard GatePass Selection");

                } else if (selectedKey === "Outward") {
                    sTitle.setProperty("text", "OutWard GatePass Selection");
                }


            },

            // data: function () {
            //     let that = this;
            //     datamanager.getF4HelpData(function (response) {

            //         //set response data in global object
            //         debugger;
            //         that.searchResponse.data = response.results;

            //     }, function (error) {
            //         console.log(error);
            //     });

            // },
            gatePassFragment: function () {
                debugger;

                let that = this;
                // this.data();
                var object = {

                    Key: 'GP'
                }


                if (object.Key) {


                    datamanager.getF4HelpData(object, function (response) {

                        //set response data in global object
                        debugger;
                        that.searchResponse.data = response.Value;



                        if (that.searchResponse.data.length > 0) {

                            that.f4Help.matData = JSON.parse(response.Value);
                            console.log(that.f4Help.matData);

                        }

                        if (that.newGateDialog1) {
                            that.newGateDialog1.destroy();
                            that.newGateDialog1 = null;
                        }


                        if (!that.newGateDialog1) {
                            that.newGateDialog1 = sap.ui.xmlfragment("gatepass.gatepass.fragments.Gatepass", that);
                            var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                            that.newGateDialog1.setModel(oModel);
                            // this.newGateDialog1.getModel().refresh(true);
                        }

                        that.newGateDialog1.getModel().refresh(true);
                        that.newGateDialog1.open();
                    }, function (error) {
                        console.log(error);
                    });
                }
            },

            selectParentItem: function (evt) {
                debugger;

                var oSelectedItem = evt.mParameters.selectedItems;

                if (oSelectedItem) {

                    var productInput1 = this.byId("gatepassNum");

                    var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);

                }

                evt.getSource().getBinding("items").filter([]);

            },




            changer: 1,
            refDocFragment: function (evt) {
                debugger;
                let that = this;
                this.changer++;
                var field = evt.mParameters.id + this.changer;

                //get dropdown selected key
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                if (selectedKey === 'PO') {
                    var object = {

                        Key: 'PO'
                    }
                } else if (selectedKey === 'GP') {
                    var object = {

                        Key: 'GP'
                    }
                } else if (selectedKey === 'SHIP') {
                    var object = {

                        Key: 'SHIP'
                    }
                } else if (selectedKey === 'OT') {
                    var object = {

                        Key: 'OT'
                    }
                } else if (selectedKey === 'SDC') {
                    var object = {

                        Key: 'SDC'
                    }
                }


                if (object.Key == 'SHIP' || object.Key == 'PO' || object.Key == 'GP' || object.Key == 'SDC') {


                    datamanager.getF4HelpData(object, function (response) {

                        that.searchResponse.data = response.Value;
                        if (that.searchResponse.data.length > 0) {

                            debugger;

                            if (selectedKey === 'OT') {
                                MessageToast.show("No F4Help Available.")
                            }

                            if (selectedKey === 'PO') {
                                that.lineItem.ITEMS = JSON.parse(response.Value);
                                console.log(that.lineItem.ITEMS);

                                if (that.newRefdocDialog1) {
                                    that.newRefdocDialog1.destroy();
                                    that.newRefdocDialog1 = null;
                                }

                                if (!that.newRefdocDialog1) {

                                    that.newRefdocDialog1 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    debugger;
                                    var oModel = new sap.ui.model.json.JSONModel(that.lineItem);
                                    //oModel.setData(arrF4Data);
                                    that.newRefdocDialog1.setModel(oModel, 'oModel');
                                    // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                    that.getView().addDependent(that.newRefdocDialog1); //addDependent to access the model in fragment
                                    that.newRefdocDialog1.bindAggregation("items", {
                                        path: "oModel>/ITEMS",
                                        template: new sap.m.StandardListItem({
                                            title: "Purchase Order Number",
                                            description: "{oModel>EBELN}"
                                        })

                                    });




                                } else {
                                    that.newRefdocDialog1.sId = field;
                                }
                                that.newRefdocDialog1.getModel().refresh(true);
                                that.newRefdocDialog1.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog1.open();


                            } if (selectedKey === 'SHIP') {
                                that.lineItem.ITEMS = JSON.parse(response.Value);
                                console.log(that.lineItem.ITEMS);

                                if (that.newRefdocDialog2) {
                                    that.newRefdocDialog2.destroy();
                                    that.newRefdocDialog2 = null;
                                }

                                if (!that.newRefdocDialog2) {

                                    that.newRefdocDialog2 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    var oModel = new sap.ui.model.json.JSONModel(that.lineItem);
                                    //oModel.setData(arrF4Data);
                                    that.newRefdocDialog2.setModel(oModel, 'oModel');
                                    // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                    that.getView().addDependent(that.newRefdocDialog2); //addDependent to access the model in fragment
                                    that.newRefdocDialog2.bindAggregation("items", {
                                        path: "oModel>/ITEMS",
                                        template: new sap.m.StandardListItem({
                                            title: "Shipment Number",
                                            description: "{oModel>TKNUM}"
                                        })

                                    });


                                } else {
                                    that.newRefdocDialog2.sId = field;
                                    that.newRefdocDialog2.getModel().refresh(true);
                                }

                                that.newRefdocDialog2.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog2.open();


                            } if (selectedKey === 'GP') {
                                that.lineItem.ITEMS = JSON.parse(response.Value);
                                console.log(that.lineItem.ITEMS);

                                if (that.newRefdocDialog3) {
                                    that.newRefdocDialog3.destroy();
                                    that.newRefdocDialog3 = null;
                                }

                                if (!that.newRefdocDialog3) {

                                    that.newRefdocDialog3 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    var oModel = new sap.ui.model.json.JSONModel(that.lineItem);
                                    //oModel.setData(arrF4Data);
                                    that.newRefdocDialog3.setModel(oModel, 'oModel');
                                    // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                    that.getView().addDependent(that.newRefdocDialog3); //addDependent to access the model in fragment
                                    that.newRefdocDialog3.bindAggregation("items", {
                                        path: "oModel>/ITEMS",
                                        template: new sap.m.StandardListItem({
                                            title: "GatePass Number",
                                            description: "{oModel>GP_NO}"
                                        })

                                    });


                                } else {
                                    that.newRefdocDialog3.sId = field;
                                    that.newRefdocDialog3.getModel().refresh(true);
                                }

                                that.newRefdocDialog3.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog3.open();
                            } if (selectedKey === 'SDC') {
                                that.lineItem.ITEMS = JSON.parse(response.Value);
                                console.log(that.lineItem.ITEMS);

                                if (that.newRefdocDialog4) {
                                    that.newRefdocDialog4.destroy();
                                    that.newRefdocDialog4 = null;
                                }

                                if (!that.newRefdocDialog4) {

                                    that.newRefdocDialog4 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    var oModel = new sap.ui.model.json.JSONModel(that.lineItem);
                                    //oModel.setData(arrF4Data);
                                    that.newRefdocDialog4.setModel(oModel, 'oModel');
                                    // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                    that.getView().addDependent(that.newRefdocDialog4); //addDependent to access the model in fragment
                                    that.newRefdocDialog4.bindAggregation("items", {
                                        path: "oModel>/ITEMS",
                                        template: new sap.m.StandardListItem({
                                            title: "Delivery Document Number",
                                            description: "{oModel>VBELN}"
                                        })

                                    });


                                } else {
                                    that.newRefdocDialog4.sId = field;
                                    that.newRefdocDialog4.getModel().refresh(true);
                                }

                                that.newRefdocDialog4.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog4.open();


                            }


                        }
                    })
                } else {
                    MessageToast.show("No Help Available For Other.");
                }



                // this.newRefdocDialog1.open();

            },


            selectRefDoc: function (evt) {
                //debugger;

                var oSelectedItem = evt.mParameters.selectedItems;

                if (oSelectedItem) {

                    var productInput1 = this.byId("refDocNum");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);

                }

                evt.getSource().getBinding("items").filter([]);

            },

            customerFragment: function () {

                debugger;
                let that = this;

                var object = {

                    Key: 'CUST'
                }

                if (object.Key) {
                    datamanager.getF4HelpData(object, function (response) {
                        debugger;
                        that.searchResponse.data = response.Value;
                        if (that.searchResponse.data.length > 0) {



                            that.f4Help.custData = JSON.parse(response.Value);
                            console.log(that.f4Help.custData);
                        }

                        if (!that.newCustDialog1) {

                            that.newCustDialog1 = sap.ui.xmlfragment("gatepass.gatepass.fragments.Customer", that);
                            var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                            that.newCustDialog1.setModel(oModel);

                        }
                        that.newCustDialog1.getModel().refresh(true);
                        that.newCustDialog1.open();
                    }, function (error) {
                        console.log(error);
                    });
                }
            },

            selectCustomer: function (evt) {
                debugger;

                var oSelectedItem = evt.mParameters.selectedItems;

                if (oSelectedItem) {

                    var productInput1 = this.byId("customerNumber");

                    var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);

                }

                evt.getSource().getBinding("items").filter([]);

            },

            supplierFragment: function () {

                debugger;
                let that = this;

                var object = {

                    Key: 'SUPP'
                }
                if (object.Key) {
                    datamanager.getF4HelpData(object, function (response) {
                        that.searchResponse.data = response.Value;

                        if (that.searchResponse.data.length > 0) {



                            that.f4Help.suppData = JSON.parse(response.Value);

                        }

                        if (!that.newSuppDialog1) {
                            that.newSuppDialog1 = sap.ui.xmlfragment("gatepass.gatepass.fragments.Supplier", that);
                            var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                            that.newSuppDialog1.setModel(oModel);
                        }
                        that.newSuppDialog1.getModel().refresh(true);
                        that.newSuppDialog1.open();
                    }, function (error) {
                        console.log(error);
                    });

                }



            },

            selectSupplier: function (evt) {
                debugger;

                var oSelectedItem = evt.mParameters.selectedItems;

                if (oSelectedItem) {

                    var productInput1 = this.byId("supplierNumber");

                    var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);

                }

                evt.getSource().getBinding("items").filter([]);

            },

            chkbox_func: function (value) {
                debugger;
                if (value === "X") {
                    return value = true;

                } else {
                    return value = false;
                }
            },
            counter: '',
            check: '',
            editable: '',
            getGPDetails: function () {
                debugger;
                this.counter = 0;
                this.counter++;
                this.check = 0;
                this.check++;
                this.editable = true;



                let that = this;
                // let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                let docValue = this.getView().byId('gatepassNum').getValue();
                if (!docValue) {
                    MessageToast.show("Please Enter GatePass No!");
                }

                let oObject = {
                    // key: selectedKey,
                    Number: docValue
                }

                if (oObject.Number) {
                    debugger;
                    datamanager.getGPDetails(oObject, function (response) {
                        debugger;
                        
                        that.objPostData = JSON.parse(response.EvJson);
                        var oModelGPDetails = new sap.ui.model.json.JSONModel(that.objPostData);

                        var oData = oModelGPDetails.getData();

                        Object.keys(oData).forEach(function (property) {
                            debugger;
                            // Apply formatter only to properties that require formatting
                            // if (property === "GP_TYPE") {
                            //     return;
                            // }

                            if (Array.isArray(oData[property])) {
                                // If the property is an array, loop through each item and apply the formatter
                                oData[property].forEach(function (item, index) {
                                    oData[property][index] = that.formate.getName(item);
                                });
                            } else {
                                // Apply the formatter directly to non-array properties
                                oData[property] = that.formate.getName(oData[property], property);
                            }
                        });

                        // Set the formatted data back to the model
                        // oModelGPDetails.setData(oData);

                        // var btnChkOut = that.getView().byId("btnChkOut");
                        // btnChkOut.setVisible(true);

                        debugger;
                        var oModel = that.getView().getModel("GPDetailsModel");
                        var oTable = that.getView().byId(that.createId("ItemData"));
                        oTable.unbindAggregation("items");

                        if (oModel) {
                            // Clear the model
                            // oModel.setData(that.objPostData);
                            oModel.setData(oData);
                        } else {
                            oModelGPDetails.setData(oData);
                            that.getView().setModel(oModelGPDetails, "GPDetailsModel");
                            var oModel = that.getView().getModel("GPDetailsModel");
                        }



                        var sCityoffice = oModel.getProperty("/CITYOFFICE");
                        var sReturnable = oModel.getProperty("/RETURNABLE");
                        var sRefDoc = oModel.getProperty("/REF_DOC");
                        var sReftype = oModel.getProperty("/REF_TYPE");
                        var sDriverName = oModel.getProperty("/DRIVER_NAME");
                        var sDriverNic = oModel.getProperty("/DRIVER_NIC");
                        var sDriverContact = oModel.getProperty("/DRIVER_CONTACT");
                        var sDriverChallan = oModel.getProperty("/DRIVER_CHALLAN");
                        var sVehicleNo = oModel.getProperty("/VEHICLE_NO");
                        var sTruckRecptNo = oModel.getProperty("/TRUCK_RECPT_NO");
                        var sReason = oModel.getProperty("/REASON");
                        var sRemarks = oModel.getProperty("/REMARKS");
                        var sSupplierNumber = oModel.getProperty("/SUPPLIER");
                        var sCustomerNumber = oModel.getProperty("/CUSTOMER");
                        var sDelivChallanDate = oModel.getProperty("/DELIV_CHALLAN_DATE");
                        var sExpDelivDate = oModel.getProperty("/EXP_DELIV_DATE");
                        var sGateIncharge = oModel.getProperty("/GATE_INCHARGE");
                        var sModeOfTransport = oModel.getProperty("/MOT");
                        var sTransport = oModel.getProperty("/TRANSPORT");
                        var sDepartment = oModel.getProperty("/DEPARTMENT");
                        var sDescription = oModel.getProperty("/DESCRIPTION");
                        var sDestination = oModel.getProperty("/DESTINATION");
                        var sExitTime = oModel.getProperty("/EXIT_TIME");
                        var sCheckInDate = oModel.getProperty("/CHECKIN_DATE");
                        var sCheckInTime = oModel.getProperty("/CHECKIN_TIME");
                        var sCheckOutDate = oModel.getProperty("/CHECKOUT_DATE");
                        var sCheckOutTime = oModel.getProperty("/CHECKOUT_TIME");
                        var sGPType = oModel.getProperty("/GP_TYPE");
                        var sDateIn = oModel.getProperty("/DATEIN");
                        var sTimeIn = oModel.getProperty("/TIMEIN");
                        var sDateOut = oModel.getProperty("/DATEOUT");
                        var sTimeOut = oModel.getProperty("/TIMEOUT");
                        var sReasonMt = oModel.getProperty("/REASON_MT");

                        var sTitle = that.getView().byId("Title1");
                        if (sGPType === "Inward") {
                            sTitle.setProperty("text", "InWard GatePass Selection");
                        } else if (sGPType === "Outward") {
                            sTitle.setProperty("text", "OutWard GatePass Selection");
                        }





                        var suppNo = that.getView().byId("supplierNumber");
                        if (sReftype === 'PO') {
                            suppNo.setRequired(true);
                        } else {
                            suppNo.setRequired(false);
                        }

                        var btnChkOut = that.getView().byId("btnChkOut");
                        if (sDateIn === undefined && sTimeIn === undefined) {
                            if (sCheckOutDate === undefined && sCheckOutTime === undefined) {
                                btnChkOut.setVisible(true);
                                var btnMT = that.getView().byId("manualTracking");
                                btnMT.setEnabled(false);
                            } else {
                                btnChkOut.setVisible(false);
                                var btnMT = that.getView().byId("manualTracking");
                                btnMT.setEnabled(false);
                            }
                        } else {
                            var form = that.getView().byId("FormChangeColumn_oneGroup235");
                            var btnMT = that.getView().byId("manualTracking");


                            form.setVisible(true);
                            btnMT.setText("Manual Tracking");
                            btnMT.setType("Default");
                            btnMT.setEnabled(false);
                            that.hide = false;
                        }



                        sCityoffice = that.chkbox_func(sCityoffice);

                        sReturnable = that.chkbox_func(sReturnable);
                        console.log(sCityoffice, sReturnable);

                        that.getView().byId("chkCityOffice").setSelected(sCityoffice);
                        that.getView().byId("chkReturnable").setSelected(sReturnable);
                        that.getView().byId("refDocNum").setValue(sRefDoc);
                        // that.getView().byId("referencesType").setValue(sReftype);
                        that.getView().byId("referencesType").setSelectedKey(sReftype);
                        that.getView().byId("DRIVER_NAME").setValue(sDriverName);
                        that.getView().byId("DRIVER_NIC").setValue(sDriverNic);
                        that.getView().byId("DRIVER_CONTACT").setValue(sDriverContact);
                        that.getView().byId("DRIVER_CHALLAN").setValue(sDriverChallan);
                        that.getView().byId("VEHICLE_NO").setValue(sVehicleNo);
                        that.getView().byId("TRUCK_RECPT_NO").setValue(sTruckRecptNo);
                        that.getView().byId("REASON").setValue(sReason);
                        that.getView().byId("REMARKS").setValue(sRemarks);
                        that.getView().byId("supplierNumber").setValue(sSupplierNumber);
                        that.getView().byId("customerNumber").setValue(sCustomerNumber);
                        that.getView().byId("DELIV_CHALLAN_DATE").setValue(sDelivChallanDate);
                        that.getView().byId("EXP_DELIV_DATE").setValue(sExpDelivDate);
                        that.getView().byId("GATE_INCHARGE").setValue(sGateIncharge);
                        that.getView().byId("MOT").setValue(sModeOfTransport);
                        that.getView().byId("TRANSPORT").setValue(sTransport);
                        that.getView().byId("DEPARTMENT").setValue(sDepartment);
                        that.getView().byId("DESCRIPTION").setValue(sDescription);
                        that.getView().byId("DESTINATION").setValue(sDestination);
                        that.getView().byId("DTP2").setValue(sExitTime);
                        that.getView().byId("checkInDate").setValue(sCheckInDate);
                        that.getView().byId("checkInTime").setValue(sCheckInTime);
                        that.getView().byId("checkOutDate").setValue(sCheckOutDate);
                        that.getView().byId("checkOutTime").setValue(sCheckOutTime);
                        that.getView().byId("GPType").setSelectedKey(sGPType);
                        that.getView().byId("GPType").setEditable(false);
                        that.getView().byId("DATEIN").setValue(sDateIn);
                        that.getView().byId("TIMEIN").setValue(sTimeIn);
                        that.getView().byId("DATEOUT").setValue(sDateOut);
                        that.getView().byId("TIMEOUT").setValue(sTimeOut);
                        that.getView().byId("REASON_MT").setValue(sReasonMt);

                        var oTable = that.getView().byId("ItemData");
                        oTable.bindItems({
                            path: 'GPDetailsModel>/ITEMS',
                            template: new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.Text({ text: "{GPDetailsModel>ITEM_NO}" }),
                                    new sap.m.Text({ text: "{GPDetailsModel>REF_DOC}" }),
                                    new sap.m.Text({ text: "{GPDetailsModel>MATERIAL_NO}" }),
                                    new sap.m.Text({ text: "{GPDetailsModel>MATERIAL_DES}" }),
                                    new sap.m.Text({ text: "{GPDetailsModel>QUANTITY}" }),
                                    new sap.m.Text({ text: "{GPDetailsModel>UOM}" })
                                ]
                            })
                        })
                    })

                }
            },
            count: 0,
            date: Date.now(),
            getItemlist: function () {
                debugger;
                this.count++;
                this.counter--;
                this.check--;

                let that = this;
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                let docValue = this.getView().byId('refDocNum').getValue();
                // that.getView().setModel(null, "lineItemModel");

                let oObject = {
                    key: selectedKey,
                    Number: docValue
                }

                if (oObject.Number) {
                    datamanager.getItemList(oObject, function (response) {

                        debugger;
                        if(response.EvJson == "[]"){
                            MessageToast.show("No Data Available");
                            var model = that.getView().getModel("lineItemModel");
                            if(model){
                                that.getView().setModel(null, "lineItemModel");
                            }
                            
                            return;
                        }

                        that.lineItem.ITEMS = JSON.parse(response.EvJson);
                        var oTable = that.getView().byId(that.createId("ItemData"));
                        oTable.unbindAggregation("items");

                        // Retrieve the existing model by name
                        var oModel = that.getView().getModel("lineItemModel");
                        if (oModel) {
                            // var data = oModel.getData();
                            // if (Object.keys(data).length === 0) {
                            oModel.setData(that.lineItem);
                            // }
                        } else {
                            // If the model doesn't exist, create it
                            var oModel = new sap.ui.model.json.JSONModel(that.lineItem);
                            that.getView().setModel(oModel, "lineItemModel");
                        }

                        // Update the existing model's data

                        // var oModellineItem = new sap.ui.model.json.JSONModel(that.lineItem);
                        // // if (!that.getView().getModel("lineItemModel")) {
                        // that.getView().setModel(oModellineItem, "lineItemModel");

                        // // }
                        // // var data = oModellineItem.getData();
                        // // // that.getView().getModel("lineItemModel").setData(data);
                        // // var oModel = that.getView().getModel("lineItemModel");
                        // // oModel.setData(data);
                        // // var oModelData = that.getView().getModel("lineItemModel").getData();
                        // // console.log(oModelData);




                        // Generate a unique identifier based on the counter value
                        var timestamp = Date.now();
                        var uniqueId = "dynamicRow_" + that.date + "_" + that.count + "_" + timestamp;
                        that.count++;
                        that.date++;

                        // var oTable = that.getView().byId(that.createId("ItemData"));
                        // oTable.unbindAggregation("items");
                        // oTable.getBinding("items").refresh();
                        // oTable.destroyItems();
                        if (selectedKey === 'GP') {
                            debugger;
                            oTable.bindItems({
                                path: 'lineItemModel>/ITEMS',
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{lineItemModel>ITEM_NO}", id: that.createId(uniqueId + "ITEM_NO") }),
                                        new sap.m.Text({ text: "{lineItemModel>REF_DOC}", id: that.createId(uniqueId + "REF_DOC") }),
                                        new sap.m.Text({ text: "{lineItemModel>MATERIAL_NO}", id: that.createId(uniqueId + "MATERIAL_NO") }),
                                        new sap.m.Text({ text: "{lineItemModel>MATERIAL_DES}", id: that.createId(uniqueId + "MATERIAL_DES") }),
                                        new sap.m.Text({ text: "{lineItemModel>QUANTITY}", id: that.createId(uniqueId + "QUANTITY") }),
                                        new sap.m.Text({ text: "{lineItemModel>UOM}", id: that.createId(uniqueId + "UOM") })
                                    ]
                                })
                            })
                        } else if (selectedKey === 'PO') {
                            debugger;
                            oTable.bindItems({
                                path: 'lineItemModel>/ITEMS',
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{lineItemModel>EBELP}", id: that.createId(uniqueId + "EBELP") }),
                                        new sap.m.Text({ text: "{lineItemModel>EBELN}", id: that.createId(uniqueId + "EBELN") }),
                                        new sap.m.Text({ text: "{lineItemModel>MATNR}", id: that.createId(uniqueId + "MATNR") }),
                                        new sap.m.Text({ text: "{lineItemModel>MAKTX}", id: that.createId(uniqueId + "MAKTX") }),
                                        new sap.m.Text({ text: "{lineItemModel>MENGE}", id: that.createId(uniqueId + "MENGE") }),
                                        new sap.m.Text({ text: "{lineItemModel>MEINS}", id: that.createId(uniqueId + "MEINS") })
                                    ]
                                })
                            })

                        } else if (selectedKey === 'SHIP') {
                            debugger;
                            oTable.bindItems({
                                path: 'lineItemModel>/ITEMS',
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{lineItemModel>TPNUM}", id: that.createId(uniqueId + "TPNUM") }),
                                        new sap.m.Text({ text: "{lineItemModel>TKNUM}", id: that.createId(uniqueId + "TKNUM") }),
                                        new sap.m.Text({ text: "{lineItemModel>VBELN}", id: that.createId(uniqueId + "VBELN") }),
                                        new sap.m.Text({ text: "{lineItemModel>SHTYP}", id: that.createId(uniqueId + "SHTYP") }),
                                        new sap.m.Text({ text: "{lineItemModel>LAUFK}", id: that.createId(uniqueId + "LAUFK") }),
                                        new sap.m.Text({ text: "{lineItemModel>DTMEG}", id: that.createId(uniqueId + "DTMEG") })
                                    ]
                                })
                            })

                        } else if (selectedKey === 'SDC') {
                            debugger;
                            oTable.bindItems({
                                path: 'lineItemModel>/ITEMS',
                                template: new sap.m.ColumnListItem({
                                    cells: [
                                        new sap.m.Text({ text: "{lineItemModel>POSNR}", id: that.createId(uniqueId + "POSNR") }),
                                        new sap.m.Text({ text: "{lineItemModel>VBELN}", id: that.createId(uniqueId + "VBELN") }),
                                        new sap.m.Text({ text: "{lineItemModel>MATNR}", id: that.createId(uniqueId + "MATNR") }),
                                        new sap.m.Text({ text: "{lineItemModel>ARKTX}", id: that.createId(uniqueId + "ARKTX") }),
                                        new sap.m.Text({ text: "{lineItemModel>LFIMG}", id: that.createId(uniqueId + "LFIMG") }),
                                        new sap.m.Text({ text: "{lineItemModel>MEINS}", id: that.createId(uniqueId + "MEINS") })
                                    ]
                                })
                            })

                        }

                        //var itemData = JSON.parse(response.EvJsonItems);

                        //var oItemDataModel = new JSONModel(itemData);
                        //that.getView().byId('ItemData').setModel(oItemDataModel, "itemData");

                    }, function (error) {
                        console.log(error);
                    });

                } else {
                    MessageToast.show("Please Enter Document Number");
                }


            },
            // county : 0,
            selectedKey: "",
            onRb1Select: function (event) {
                debugger;

                let rb1Val = event.getSource().getSelected();



                setTimeout(() => {

                    if (rb1Val === true) {
                        // Handle logic for radio button 1 select



                        let rb1Val = this.getView().byId('RB4-1').getSelected();
                        if (rb1Val === true) {
                            //this.getView().byId('referencesType').setEditable(false);
                            this.getView().byId('referencesType').setEnabled(false);
                            this.getView().byId('refDocNum').setEnabled(false);
                            this.getView().byId('gatepassNum').setEnabled(true);
                            this.getView().byId('save').setEnabled(true);
                            this.getView().byId('delete').setEnabled(true);
                            this.getView().byId('createGP').setEnabled(false);
                            this.getView().byId('create').setEnabled(false);
                            this.getView().byId('btnGo').setEnabled(false);
                            this.getView().byId('btnEdit').setEnabled(true);
                            debugger;
                            let gpDataModel = this.getView().getModel("gpData");
                            let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                            // let GPDetailsModel = this.getView().getModel("GPDetailsModel")
                            if (gpDataModel && selectedKey) {
                                // let selectedKey = gpDataModel.getProperty("/REF_TYPE");

                                //     console.log("Selected Key:", selectedKey);
                                var suppNo = this.getView().byId("supplierNumber");

                                switch (selectedKey) {
                                    case "PO":

                                        gpDataModel.setProperty("/REF_TYPE", "PO");
                                        suppNo.setRequired(true);
                                        break;
                                    case "SHIP":

                                        gpDataModel.setProperty("/REF_TYPE", "SHIP");
                                        suppNo.setRequired(false);
                                        break;
                                    case "GP":
                                        gpDataModel.setProperty("/REF_TYPE", "GP");
                                        suppNo.setRequired(false);
                                        break;
                                    case "OT":
                                        gpDataModel.setProperty("/REF_TYPE", "OT");
                                        suppNo.setRequired(false);
                                        break;
                                    case "SDC":
                                        gpDataModel.setProperty("/REF_TYPE", "SDC");
                                        suppNo.setRequired(false);
                                        break;
                                    default:
                                        console.warn("Unexpected selected key:", selectedKey);
                                        // Handle other cases or do nothing
                                        break;
                                }
                            }

                        }
                    }
                }, 0);

            },
            counted: 0,
            onRb2Select: function (event) {
                debugger;

                let selectedKey;
                let rb2Val = event.getSource().getSelected();
                setTimeout(() => {

                    if (rb2Val === true) {
                        // Handle logic for radio button 2 select

                        debugger;
                        let rb2Val = this.getView().byId('RB4-2').getSelected();
                        if (!(this.counter == 1)) {
                            selectedKey = this.getView().byId("referencesType").getSelectedKey();
                        }
                        if (rb2Val === true) {
                            this.getView().byId('gatepassNum').setEnabled(false);
                            this.getView().byId('referencesType').setEnabled(true);
                            this.getView().byId('refDocNum').setEnabled(true);
                            this.getView().byId('save').setEnabled(false);
                            this.getView().byId('delete').setEnabled(false);
                            this.getView().byId('createGP').setEnabled(true);
                            this.getView().byId('btnEdit').setEnabled(false);
                            this.getView().byId('btnGo').setEnabled(true);
                            this.getView().byId('create').setEnabled(true);
                            // let referencesTypeControl = this.getView().byId("referencesType");
                            let gpDataModel = this.getView().getModel("gpData")
                            let GPDetailsModel = this.getView().getModel("GPDetailsModel")

                            if (GPDetailsModel) {
                                if (this.counter == 1) {
                                    selectedKey = GPDetailsModel.getProperty("/REF_TYPE");

                                }

                                console.log("Selected Key:", selectedKey);
                                var suppNo = this.getView().byId("supplierNumber");
                                // if(selectedKey === selectedKey1){

                                switch (selectedKey) {
                                    case "PO":

                                        gpDataModel.setProperty("/REF_TYPE", "PO");
                                        suppNo.setRequired(true);

                                        break;
                                    case "SHIP":

                                        gpDataModel.setProperty("/REF_TYPE", "SHIP");
                                        suppNo.setRequired(false);
                                        break;
                                    case "GP":
                                        gpDataModel.setProperty("/REF_TYPE", "GP");
                                        suppNo.setRequired(false);
                                        break;
                                    case "OT":
                                        gpDataModel.setProperty("/REF_TYPE", "OT");
                                        suppNo.setRequired(false);
                                        break;
                                    case "SDC":
                                        gpDataModel.setProperty("/REF_TYPE", "SDC");
                                        suppNo.setRequired(false);
                                        break;
                                    default:
                                        console.warn("Unexpected selected key:", selectedKey);
                                        // Handle other cases or do nothing
                                        break;
                                }
                                // }
                            }
                            if (this.counter == 1) {
                                this.counter--;
                                this.counted = 1;
                            }
                        }
                    }
                }, 0);


            },
            oItem: null,



            Count: 0,
            // measure : false,
            onAddRow: function () {
                debugger;
                var that = this;
                // var Counter = this.counter;
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                let rb2Val = this.getView().byId('RB4-2').getSelected();
                // let rb1Val = this.getView().byId('RB4-1').getSelected();


                this.Count++;

                // Generate unique IDs based on the counter
                var input1Id = "input1_" + this.Count;
                var input2Id = "input2_" + this.Count;
                var input3Id = "input3_" + this.Count;
                var input4Id = "input4_" + this.Count;
                var input5Id = "input5_" + this.Count;
                var input6Id = "input6_" + this.Count;





                if (rb2Val == true && selectedKey == 'OT') {
                    // Initialize the model for the new item
                    var oModel = this.getView().getModel("lineItemModel1");


                    if (!oModel) {
                        var oModellineItem = new sap.ui.model.json.JSONModel(this.lineItem);
                        this.getView().setModel(oModellineItem, "lineItemModel1");
                        var oModel = this.getView().getModel("lineItemModel1");
                        oModel.setData({ ITEMS: [] });
                    } else {
                        var itemsArray = oModel.getProperty("/ITEMS");

                        if (itemsArray !== "") {
                            itemsArray.forEach(function (item) {
                                debugger;
                                if (!('ITEM_NO' in item) || ('GP_NO' in item)) {
                                    oModel.setData({ ITEMS: [] });
                                    // that.measure= true;
                                }
                            });
                        }

                    }


                    if (this.counted === 0) {
                        oModel.setData({ ITEMS: [] });
                        var oModel1 = this.getView().getModel("GPDetailsModel");
                        if (oModel1) {
                            oModel1.setData({ ITEMS: [] });
                        }
                        this.counted++;

                        var oNewItemData = {
                            ITEM_NO: "",
                            REF_DOC: "",
                            MATERIAL_NO: "",
                            MATERIAL_DES: "",
                            QUANTITY: "",
                            UOM: "",
                        };
                    } else {
                        var oModel1 = this.getView().getModel("GPDetailsModel");
                        if (oModel1) {

                            var data = oModel1.getData();
                            if (!data || !data.ITEMS || data.ITEMS.length === 0) {
                                oModel1.setData({ ITEMS: [] })
                                // oModel.setData({ ITEMS: [] });
                            } else if (that.check === 1) {
                                oModel.setData(data);
                            }


                            var oNewItemData = {
                                ITEM_NO: "",
                                REF_DOC: "",
                                MATERIAL_NO: "",
                                MATERIAL_DES: "",
                                QUANTITY: "",
                                UOM: "",
                            };

                        } else {
                            var oNewItemData = {
                                ITEM_NO: "",
                                REF_DOC: "",
                                MATERIAL_NO: "",
                                MATERIAL_DES: "",
                                QUANTITY: "",
                                UOM: "",
                            };
                        }

                    }


                    var oLineItem = oModel.getData();
                    oLineItem.ITEMS = oLineItem.ITEMS || [];

                    var oTable = this.getView().byId("ItemData");
                    oTable.unbindAggregation("items");

                    this.getView().setModel(oModel, "lineItemModel");
                    this.isEditMode = true;


                    // oTable.addItem(oItem);
                    //     if(selected == "PO"){
                    //     oTable.bindAggregation("items", "lineItemModel>/ITEMS", new sap.m.ColumnListItem({
                    //         cells: [
                    //             new sap.m.Input({ value: "{lineItemModel>EBELP}", id: input1Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>EBELN}", id: input2Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>MATNR}", id: input3Id, showValueHelp: true }),
                    //             new sap.m.Input({ value: "{lineItemModel>MAKTX}", id: input4Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>MENGE}", id: input5Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>MEINS}", id: input6Id }),
                    //         ]
                    //     }));
                    //    }else if(selected == "SHIP"){
                    //     oTable.bindAggregation("items", "lineItemModel>/ITEMS", new sap.m.ColumnListItem({
                    //         cells: [
                    //             new sap.m.Input({ value: "{lineItemModel>TPNUM}", id: input1Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>TKNUM}", id: input2Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>VBELN}", id: input3Id, showValueHelp: true }),
                    //             new sap.m.Input({ value: "{lineItemModel>SHTYP}", id: input4Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>LAUFK}", id: input5Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>DTMEG}", id: input6Id }),
                    //         ]
                    //     }));
                    //    }else if(selected == "GP"){
                    oTable.bindAggregation("items", "lineItemModel>/ITEMS", new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Input({ value: "{lineItemModel>ITEM_NO}", id: input1Id }),
                            new sap.m.Input({ value: "{lineItemModel>REF_DOC}", id: input2Id }),
                            new sap.m.Input({ value: "{lineItemModel>MATERIAL_NO}", id: input3Id }),
                            new sap.m.Input({ value: "{lineItemModel>MATERIAL_DES}", id: input4Id }),
                            new sap.m.Input({ value: "{lineItemModel>QUANTITY}", id: input5Id }),
                            new sap.m.Input({ value: "{lineItemModel>UOM}", id: input6Id }),
                        ]
                    }));
                    //    }else if(selected == "OT"){
                    //     oTable.bindAggregation("items", "lineItemModel>/ITEMS", new sap.m.ColumnListItem({
                    //         cells: [
                    //             new sap.m.Input({ value: "{lineItemModel>input1}", id: input1Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>input2}", id: input2Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>input3}", id: input3Id, showValueHelp: true }),
                    //             new sap.m.Input({ value: "{lineItemModel>input4}", id: input4Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>input5}", id: input5Id }),
                    //             new sap.m.Input({ value: "{lineItemModel>input6}", id: input6Id }),
                    //         ]
                    //     }));
                    //    }

                    oLineItem.ITEMS.push(oNewItemData);

                    // Set the modified "lineItem" back to the model
                    oModel.setData(oLineItem);
                    // oModel.updateBindings(true);

                    // Store the current oItem for future reference or modifications
                    // this.oItem = oItem;
                } else {
                    MessageToast.show("Not allowed for Reference Doc");
                }
            },





            isEditMode: '',
            onSaveRow: function () {
                debugger;
                var that = this;
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                if (selectedKey == 'OT' || selectedKey == 'PO' || selectedKey == 'SHIP' || selectedKey == 'SDC') {
                    var oTable = this.getView().byId("ItemData");
                    var aItems = oTable.getItems();
                    aItems.forEach(function (oItem) {
                        debugger;
                        var Toast;
                        oItem.getCells().forEach(function (oCell) {
                            if (oCell instanceof sap.m.Text) {
                                debugger;
                                if (selectedKey == 'PO' || selectedKey == 'SHIP' || selectedKey == 'SDC') {
                                    var result = oCell.sId;
                                    if (result.includes('MENGE') || result.includes('LAUFK') || result.includes('LFIMG')) {
                                        Toast = true;
                                    }
                                } else if (selectedKey == 'OT') {
                                    Toast = true;
                                }

                                return;



                            } else if (oCell instanceof sap.m.Input) {
                                debugger;
                                // Enable the input fields

                                oCell.setEnabled(false);
                                that.isEditMode = false;


                            }
                        });
                        if (Toast === true) {
                            MessageToast.show("Please make changes to Save!");
                        }
                    });
                } else {
                    MessageToast.show("Not allowed for Reference Doc");
                }
            },


            // onEditRow: function () {
            //     debugger;
            //     var that = this;
            //     let selectedKey = this.getView().byId("referencesType").getSelectedKey();
            //     if (selectedKey == 'OT') {
            //         var oTable = this.getView().byId("ItemData");
            //         var aItems = oTable.getItems();
            //         aItems.forEach(function (oItem) {
            //             oItem.getCells().forEach(function (oCell) {
            //                 if (oCell instanceof sap.m.Text) {
            //                     var oInput = new sap.m.Input({
            //                         value: oCell.getText(), // Set the initial value from the text
            //                         width: "100%",// Set the width as needed
            //                         change: that.onInputChange.bind(that)
            //                     });
            //                     // Replace the Text control with the Input control
            //                     oItem.removeCell(oCell);
            //                     oItem.addCell(oInput);
            //                     that.isEditMode = true;
            //                 } else if (oCell instanceof sap.m.Input) {
            //                     // Enable the input fields
            //                     oCell.setEnabled(true);
            //                     that.isEditMode = true;
            //                 }
            //             });
            //         });
            //     } else {
            //         MessageToast.show("Not allowed for Reference Doc");
            //     }
            // },




            onEditRow: function () {
                debugger;
                var that = this;

                // Get the selected key
                let selectedKey = this.getView().byId("referencesType").getSelectedKey();

                var oTable = this.getView().byId("ItemData");
                var aItems = oTable.getItems();
                aItems.forEach(function (oItem) {
                    var oCells = oItem.getCells();
                    var oQuantityCell = oCells[4];


                    // Check the selected key
                    // if (selectedKey == 'OT') {
                    //     // For 'OT' case, make all fields editable
                    //     oCells.forEach(function (oCell) {
                    //         if (oCell instanceof sap.m.Input) {
                    //             oCell.setEnabled(true);
                    //             that.isEditMode = true;
                    //         }
                    //     });

                    if (selectedKey == 'OT') {
                        // var oTable = this.getView().byId("ItemData");
                        // var aItems = oTable.getItems();
                        // aItems.forEach(function (oItem) {
                        oItem.getCells().forEach(function (oCell) {
                            if (oCell instanceof sap.m.Text) {
                                var oInput = new sap.m.Input({
                                    value: oCell.getText(), // Set the initial value from the text
                                    width: "100%",// Set the width as needed
                                    change: that.onInputChange.bind(that)
                                });
                                // Replace the Text control with the Input control
                                oItem.removeCell(oCell);
                                oItem.addCell(oInput);
                                that.isEditMode = true;
                            } else if (oCell instanceof sap.m.Input) {
                                // Enable the input fields
                                oCell.setEnabled(true);
                                that.isEditMode = true;
                            }
                        });
                        // });


                    } else if (selectedKey == 'PO' || selectedKey == 'SHIP' || selectedKey == 'SDC') {
                        // For 'PO' and 'SHIP' cases, make only the quantity field editable
                        if (oQuantityCell instanceof sap.m.Text) {
                            var oInput = new sap.m.Input({
                                value: oQuantityCell.getText(), // Set the initial value from the text
                                width: "100%", // Set the width as needed
                                change: that.onRefInputChange.bind(that)

                            });
                            // Replace the Text control with the Input control at the correct index
                            var quantityIndex = oCells.indexOf(oQuantityCell);
                            oItem.removeCell(oQuantityCell);
                            oItem.insertCell(oInput, quantityIndex);
                            that.isEditMode = true;
                        } else if (oQuantityCell instanceof sap.m.Input) {
                            // Enable the input field
                            oQuantityCell.setEnabled(true);
                            that.isEditMode = true;
                        }
                        // Disable other fields
                        oCells.forEach(function (oCell) {
                            if (oCell !== oQuantityCell) {
                                if (oCell instanceof sap.m.Input) {
                                    oCell.setEnabled(false);
                                }
                            }
                        });
                    }
                });
                if(selectedKey == 'GP'){
                    MessageToast.show("Not Allowed For GatePass Doc.")
                }
            },







            Validator: function () {
                debugger;
                var DriverNamebyid = this.getView().byId("DRIVER_NAME");
                var DriverName = DriverNamebyid.getValue();
                if (DriverName === '') {
                    DriverNamebyid.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Driver Name!");
                    return false;
                } else {
                    DriverNamebyid.setValueState(ValueState.None);
                }

                var DriverNicbyid = this.getView().byId("DRIVER_NIC");
                var DriverNic = DriverNicbyid.getValue();
                if (DriverNic === '') {
                    DriverNicbyid.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Driver NIC!");
                    return false;
                } else {
                    DriverNicbyid.setValueState(ValueState.None);
                }

                var VehicleNobyid = this.getView().byId("VEHICLE_NO");
                var VehicleNo = VehicleNobyid.getValue();
                if (VehicleNo === '') {
                    VehicleNobyid.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Vehicle Number!");
                    return false;
                } else {
                    VehicleNobyid.setValueState(ValueState.None);
                }

                var refType = this.getView().byId("referencesType").getSelectedKey();
                var suppNo = this.getView().byId("supplierNumber");
                if (refType === 'PO') {
                    var SupplierNumberbyid = this.getView().byId("supplierNumber");
                    var SupplierNumber = SupplierNumberbyid.getValue();
                    if (SupplierNumber === '') {
                        SupplierNumberbyid.setValueState(ValueState.Error);
                        MessageToast.show("Please Add Supplier Number!");
                        return false;
                    } else {
                        SupplierNumberbyid.setValueState(ValueState.None);
                    }
                    suppNo.setRequired(true);
                }

                // var CustomerNumberbyid = this.getView().byId("customerNumber");
                // var CustomerNumber = CustomerNumberbyid.getValue();
                // if (CustomerNumber === '') {
                //     CustomerNumberbyid.setValueState(ValueState.Error);
                //     MessageToast.show("Please Add Customer Number!");
                //     return false;
                // } else {
                //     CustomerNumberbyid.setValueState(ValueState.None);
                // }

                var GateInchargebyid = this.getView().byId("GATE_INCHARGE");
                var GateIncharge = GateInchargebyid.getValue();
                if (GateIncharge === '') {
                    GateInchargebyid.setValueState(ValueState.Error);
                    MessageToast.show("Please Add Gate Incharge!");
                    return false;
                } else {
                    GateInchargebyid.setValueState(ValueState.None);
                }

                var Destinationbyid = this.getView().byId("DESTINATION");
                var Destination = Destinationbyid.getValue();
                if (Destination === '') {
                    Destinationbyid.setValueState(ValueState.Error);
                    MessageToast.show("Please Add Destination!");
                    return false;
                } else {
                    Destinationbyid.setValueState(ValueState.None);
                }

                var Deldate = this.getView().byId("DELIV_CHALLAN_DATE").getValue();
                var Expdatebyid = this.getView().byId("EXP_DELIV_DATE");
                var Expdate = this.getView().byId("EXP_DELIV_DATE").getValue();
                if (Deldate && Expdate) {
                    if (Deldate > Expdate) {
                        // Show error message or handle validation failure
                        Expdatebyid.setValueState(ValueState.Error);
                        sap.m.MessageToast.show("Start date cannot be greater than end date.");
                        // Reset the input values or take necessary action
                        // this.getView().byId("startDateInput").setValue("");
                        this.getView().byId("EXP_DELIV_DATE").setValue("");
                        return false;
                    }
                    else {
                        Expdatebyid.setValueState(ValueState.None);
                    }
                }
                // All fields are valid
                return true;
            },


            ValidatorForMT: function () {
                debugger;

                var DateInById = this.getView().byId("DATEIN");
                var DateIn = DateInById.getValue();
                if (DateIn === '') {
                    DateInById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Date Check In!");
                    return false;
                } else {
                    DateInById.setValueState(ValueState.None);
                }

                var TimeInById = this.getView().byId("TIMEIN");
                var TimeIn = TimeInById.getValue();
                if (TimeIn === '') {
                    PurposeOfVisitById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Time Check In!");
                    return false;
                } else {
                    TimeInById.setValueState(ValueState.None);
                }
                var DateOutById = this.getView().byId("DATEOUT");
                var DateOut = DateOutById.getValue();
                if (DateOut === '') {
                    DateOutById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Date Check Out!");
                    return false;
                } else {
                    DateOutById.setValueState(ValueState.None);
                }


                var TimeOutById = this.getView().byId("TIMEOUT");
                var TimeOut = TimeOutById.getValue();
                if (TimeOut === '') {
                    TimeOutById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Time Check In!");
                    return false;
                } else {
                    TimeOutById.setValueState(ValueState.None);
                }

                var ReasonMTById = this.getView().byId("REASON_MT");
                var ReasonMT = ReasonMTById.getValue();
                if (ReasonMT === '') {
                    ReasonMTById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Reason For Manual Tracking!");
                    return false;
                } else {
                    ReasonMTById.setValueState(ValueState.None);
                }

                if (DateIn > DateOut) {
                    var DateOutById = this.getView().byId("DATEOUT");
                    sap.m.MessageToast.show("CheckIn date cannot be greater than CheckOut date.");
                    DateOutById.setValueState(ValueState.Error);
                    this.getView().byId("DATEOUT").setValue("");
                    return false;
                } else {
                    DateOutById.setValueState(ValueState.None);
                }

                if (DateIn == DateOut) {
                    var TimeOutById = this.getView().byId("TIMEOUT");
                    var TimeOut = TimeOutById.getValue();
                    var TimeInById = this.getView().byId("TIMEIN");
                    var TimeIn = TimeInById.getValue();
                    if (TimeIn > TimeOut) {
                        sap.m.MessageToast.show("CheckIn date cannot be greater than CheckOut date.");
                        TimeOutById.setValueState(ValueState.Error);
                        this.getView().byId("TIMEOUT").setValue("");
                        return false;
                    } else {
                        TimeOutById.setValueState(ValueState.None);
                    }

                }

                // All fields are valid
                return true;
            },

            exceed : false,
            onCreateGP: function () {
                debugger;
                this.exceed = false;
                let that = this;
                //let itemArray = [];

                //var gpCreationData = this.getView().getModel('gpData').oData;
                console.log(this.getView().getModel('gpData').getData());
                this.getView().getModel('gpData').refresh(true);
                let selected = this.getView().byId("GPType").getSelectedKey();

                var gpCreationData = this.getView().getModel('gpData').getData();
                console.log(gpCreationData);
                this.objPostData = gpCreationData;
                this.objPostData.GP_Type = selected;

                if (this.hide === false) {
                    var currentDate = new Date();

                    // Get individual components of the current date and time
                    var currentYear = currentDate.getFullYear();
                    var currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
                    var currentDay = currentDate.getDate();
                    var currentHours = currentDate.getHours();
                    var currentMinutes = currentDate.getMinutes();
                    var currentSeconds = currentDate.getSeconds();

                    // Format the date and time components as needed
                    var formattedDate = currentYear + "-" + (currentMonth < 10 ? "0" : "") + currentMonth + "-" + (currentDay < 10 ? "0" : "") + currentDay;
                    var formattedTime = (currentHours < 10 ? "0" : "") + currentHours + ":" + (currentMinutes < 10 ? "0" : "") + currentMinutes + ":" + (currentSeconds < 10 ? "0" : "") + currentSeconds;

                    this.objPostData.CHECKIN_DATE = formattedDate;
                    this.objPostData.CHECKIN_TIME = formattedTime;
                }


                var V = this.Validator();
                if (V === true) {
                    debugger;

                    var Ref_Type = this.objPostData.REF_TYPE;
                    // this.getView().getModel('lineItemModel').refresh(true);
                    var oModel = this.getView().getModel('lineItemModel');
                    if (oModel) {
                        var model = oModel.getData();
                        var data = oModel.getData().ITEMS;
                    }


                    var oTable = this.getView().byId("ItemData");

                    // Iterate through the items in the table and disable input fields
                    // var aItems = oTable.getItems();
                    var aItems = oTable.getItems();
                    var aVisibleData = []; // Array to store data from visible rows


                    // Loop through each visible row
                    var edit;
                    aItems.forEach(function (oRow) {
                        debugger;
                        var oContext = oRow.getBindingContext("lineItemModel"); // Get the binding context of the row
                        if (oContext === undefined) {
                            MessageToast.show("Please Edit your Gatepass!")
                            edit = true;
                        } else {
                            var oRowData = oContext.getObject(); // Get the model data associated with the row
                            aVisibleData.push(oRowData); // Push the row data to the array
                        }
                    });

                    if (edit === true) {
                        return;
                    }


                    console.log(aVisibleData);

                    var v = this.getView().getModel('GPDetailsModel')
                    if (v) {
                        v.setData({ ITEMS: [] });
                    }


                    if (oModel != undefined) {
                        if (aVisibleData.length === data.length) {
                            var arraysAreEqual = true;
                            // Loop through each element and compare
                            for (var i = 0; i < aVisibleData.length; i++) {
                                if (JSON.stringify(aVisibleData[i]) !== JSON.stringify(data[i])) {
                                    // If any elements are different, set arraysAreEqual to false and break the loop
                                    arraysAreEqual = false;
                                    break;
                                }
                            }
                            if (arraysAreEqual) {
                                var oItems = oModel.getData().ITEMS;
                                // Do something if arrays are equal
                            }
                        } else {
                            oModel.setData({ ITEMS: [] });
                        }


                        var table = this.getView().byId("ItemData");
                        var rows = table.getItems();
                        var isEmpty = false;

                        rows.forEach(function (row) {
                            var cells = row.getCells();
                            cells.forEach(function (cell) {
                                if (cell instanceof sap.m.Input) { // Check if the cell is an input field
                                    var value = cell.getValue();
                                    if (!value) {
                                        isEmpty = true;
                                        cell.setValueState(sap.ui.core.ValueState.Error);
                                    } else {
                                        cell.setValueState(sap.ui.core.ValueState.None);
                                    }
                                }
                            });
                        });

                        if (isEmpty) {
                            sap.m.MessageToast.show("Please fill in all fields.");
                        } else {




                            // Get the current data from the model
                            var currentData = oModel.getData();

                            // Iterate over each entry in newData
                            var selectedKey = this.getView().byId("referencesType").getSelectedKey();
                            if (selectedKey == 'PO' || selectedKey == 'SHIP' || selectedKey == 'SDC') {
                                Object.keys(that.updatedData).forEach(function (rowno) {
                                    debugger;
                                    var newValue = that.updatedData[rowno];
                                    // Update the corresponding record in currentData
                                    var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                                    if (record) {
                                        // Update the quantity field with newValue
                                        if (selectedKey == 'PO') {
                                            if(parseInt(newValue) > record.MENGE ){
                                               that.exceed =true; 
                                            }else{
                                                record.MENGE = parseInt(newValue);
                                            }
                                            // Adjust quantityField with the actual field name in your model
                                        } else if (selectedKey == 'SHIP') {

                                            if(parseInt(newValue) > record.LAUFK ){
                                                that.exceed =true; 
                                             }else{
                                                 record.LAUFK = parseInt(newValue);
                                             }
                                            
                                        } else if (selectedKey == 'SDC') {

                                            if(parseInt(newValue) > record.LFIMG ){
                                                that.exceed =true; 
                                             }else{
                                                 record.LFIMG = parseInt(newValue);
                                             }
                                            
                                        }
                                    }
                                });

                                // Set the updated data back to the model
                                oModel.setData(currentData);
                                
                            }

                            if (that.exceed) {
                                sap.m.MessageToast.show("New value cannot be greater than the original quantity.");
                                return; // Stop the execution of the function
                            }


                            if (oItems) {
                                if (oItems.length !== 0) {
                                    that.objPostData.ITEMS = [];
                                    if (Ref_Type === "PO") {
                                        oItems.forEach(function (obj) {
                                            var objItem = {
                                                "REF_DOC": obj.EBELN,
                                                "MATERIAL_NO": obj.MATNR,
                                                "MATERIAL_DES": obj.MAKTX,
                                                "QUANTITY": obj.MENGE,
                                                "UOM": obj.MEINS
                                            }

                                            that.objPostData.ITEMS.push(objItem);

                                        });
                                    } else if (Ref_Type === "SHIP") {

                                        oItems.forEach(function (obj) {
                                            var objItem = {
                                                "REF_DOC": obj.TKNUM,
                                                "MATERIAL_NO": obj.VBELN,
                                                "MATERIAL_DES": obj.SHTYP,
                                                "QUANTITY": obj.LAUFK,
                                                "UOM": obj.DTMEG
                                            }

                                            that.objPostData.ITEMS.push(objItem);

                                        });



                                    } else if (Ref_Type === "GP" || Ref_Type === "OT") {

                                        oItems.forEach(function (obj) {
                                            var objItem = {
                                                "REF_DOC": obj.REF_DOC,
                                                "MATERIAL_NO": obj.MATERIAL_NO,
                                                "MATERIAL_DES": obj.MATERIAL_DES,
                                                "QUANTITY": obj.QUANTITY,
                                                "UOM": obj.UOM
                                            }

                                            that.objPostData.ITEMS.push(objItem);

                                        });

                                    }
                                    else if (Ref_Type === "SDC") {
                                        debugger;
                                        oItems.forEach(function (obj) {
                                            debugger;
                                            var objItem = {
                                                "REF_DOC": obj.VBELN,
                                                "MATERIAL_NO": obj.MATNR,
                                                "MATERIAL_DES": obj.ARKTX,
                                                "QUANTITY": obj.LFIMG,
                                                "UOM": obj.MEINS
                                            }

                                            that.objPostData.ITEMS.push(objItem);
                                        });
                                    }
                                    if (this.editable === true) {
                                        MessageToast.show("Please Edit your Gatepass!")

                                    } else {
                                        if (this.isEditMode === true && (Ref_Type === "OT" || Ref_Type === "PO" || Ref_Type === "SHIP" || Ref_Type === "SDC")) {
                                            MessageToast.show("Please Save the Table records!");
                                        } else if (this.hide === false) {


                                            datamanager.createData(that.objPostData, function (success) {
                                                console.log(success);
                                                MessageToast.show("GatePass Created Succesfully!");
                                            }, function (error) {
                                                console.log(error);
                                            });
                                            this.getView().setModel(null, "lineItemModel");
                                            this.getView().setModel(null, "lineItemModel1");
                                            this.onAction();
                                            this.isEditMode = '';
                                            that.updateData = {};
                                        } else {
                                            var V1 = this.ValidatorForMT();
                                            if (V1 === true) {


                                                datamanager.createData(that.objPostData, function (success) {
                                                    console.log(success);
                                                    MessageToast.show("GatePass Created Succesfully!");
                                                }, function (error) {
                                                    console.log(error);
                                                });
                                                this.getView().setModel(null, "lineItemModel");
                                                this.getView().setModel(null, "lineItemModel1");
                                                this.onAction();
                                                this.isEditMode = '';
                                                that.updateData = {};
                                            }

                                        }

                                    }



                                } else {
                                    MessageToast.show("Please Enter Item Details!");
                                }

                            } else {
                                MessageToast.show("Please Enter Item Details!");
                                oModel.setData(model);
                            }
                        }


                    } else {
                        MessageToast.show("Please Enter Item Details!");
                    }




                }





            },

            onDownloadGP: function () {
                debugger;
                var that = this;

                datamanager.adobeForm(function (success) {
                    debugger;
                    var base64EncodedPDF = "";
                    base64EncodedPDF = success.EvJson; // the encoded string
                    var decodedPdfContent = atob(base64EncodedPDF);
                    var byteArray = new Uint8Array(decodedPdfContent.length)
                    for (var i = 0; i < decodedPdfContent.length; i++) {
                        byteArray[i] = decodedPdfContent.charCodeAt(i);
                    }
                    var blob = new Blob([byteArray.buffer], { type: 'application/pdf' });
                    var _pdfurl = URL.createObjectURL(blob);

                    if (!that._PDFViewer || that._PDFViewer) {
                        that._PDFViewer = new sap.m.PDFViewer({
                            width: "auto",
                            source: _pdfurl // my blob url
                        });
                        jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                    }
                    that._PDFViewer.open();


                    console.log(success);
                    // MessageToast.show("GatePass Downloaded Succesfully!");
                }, function (error) {
                    console.log(error);
                });

            },


            onInputChange: function (oEvent) {
                debugger;
                var sNewValue = oEvent.getParameter("value"); // Get the new value from the input field
                var oInput = oEvent.getSource(); // Get the input field control
                var oRow = oInput.getParent(); // Get the parent row of the input field
                var oTable = oRow.getParent(); // Get the table containing the row
                var iColumnIndex = oRow.indexOfCell(oInput); // Get the column index of the input field within the row

                var oContext = oRow.getBindingContext("GPDetailsModel"); // Get the binding context
                var sPath = oContext.getPath(); // Get the path of the item
                var oModel = oContext.getModel(); // Get the model
                var aItems = oModel.getProperty("/ITEMS"); // Get the ITEMS array

                // Update the corresponding property of the item
                var iRowIndex = parseInt(sPath.split("/").pop()); // Extract the index of the row
                var oItem = aItems[iRowIndex]; // Get the item object corresponding to the row
                // Update the property value based on the column index
                switch (iColumnIndex) {
                    case 1:
                        oItem.REF_DOC = sNewValue;
                        break;
                    case 2:
                        oItem.MATERIAL_NO = sNewValue;
                        break;
                    case 3:
                        oItem.MATERIAL_DES = sNewValue;
                        break;
                    case 4:
                        oItem.QUANTITY = sNewValue;
                        break;
                    case 5:
                        oItem.UOM = sNewValue;
                        break;
                }

                // Set the updated array back to the model
                oModel.setProperty(sPath + "/ITEMS", aItems);

                // Refresh the model to reflect the changes in the UI
                oModel.refresh(true);
                var data = oModel.getData();
                var lineModel = this.getView().getModel("lineItemModel");
                if (lineModel) {
                    lineModel.setData(data);
                } else {
                    this.getView().setModel(new sap.ui.model.json.JSONModel({ ITEMS: data.ITEMS }), "lineItemModel");
                }
            },


            validateInput: function (cell, newValue, originalValue) {
                // Check if the new value is different from the original value
                debugger;
                if (parseInt(newValue) !== originalValue) {
                    // Check if the new value is greater than the original value
                    if (parseFloat(newValue) > parseFloat(originalValue)) {
                        // Show error message and set field state to error
                        sap.m.MessageToast.show("New value cannot be greater than the original value.");
                        cell.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        // Clear error state if the value is valid
                        cell.setValueState(sap.ui.core.ValueState.None);
                    }
                } else {
                    // Reset the field to its original state if the user re-enters the original value
                    cell.setValue(originalValue);
                    this.quantity = newValue;
                    cell.setValueState(sap.ui.core.ValueState.None); // Clear error state
                }
            },



            updatedData: {},

            // Function to update the locally stored data
            updateDataLocally: function (recordId, newValue) {
                debugger;
                this.updatedData[recordId] = newValue;
            },

            quantity: 0,
            onRefInputChange: function (oEvent) {
                debugger;
                var selectedKey = this.getView().byId("referencesType").getSelectedKey();
                var sNewValue = oEvent.getParameter("value"); // Get the new value from the input field
                var oInput = oEvent.getSource(); // Get the input field control
                var oRow = oInput.getParent(); // Get the parent row of the input field
                var oTable = oRow.getParent(); // Get the table containing the row
                var iColumnIndex = oRow.indexOfCell(oInput); // Get the column index of the input field within the row

                var sModelName;
                var sPath;
                var aItems;
                var oModel;

                // Determine the model and path based on the table's model
                if (oTable.mBindingInfos.items.model === 'lineItemModel') {
                    // For 'PO' and 'SHIP' cases
                    sModelName = "lineItemModel";
                    sPath = oRow.getBindingContext("lineItemModel").getPath(); // Get the path of the item
                    oModel = this.getView().getModel("lineItemModel"); // Get the model
                } else if (oTable.mBindingInfos.items.model === 'GPDetailsModel') {
                    // For 'PO' and 'SHIP' cases
                    sModelName = "GPDetailsModel";
                    sPath = oRow.getBindingContext("GPDetailsModel").getPath(); // Get the path of the item
                    oModel = this.getView().getModel("GPDetailsModel"); // Get the model
                }

                var aItems = oModel.getProperty(sPath); // Get the ITEMS array

                // Update the corresponding property of the item
                // var iRowIndex = parseInt(sPath.split("/").pop()); // Extract the index of the row
                var oItem = aItems; // Get the item object corresponding to the row
                // Update the property value based on the column index
                if (selectedKey === 'PO') {
                    switch (iColumnIndex) {
                        case 1:
                            oItem.EBELN = sNewValue;
                            break;
                        case 2:
                            oItem.MATNR = sNewValue;
                            break;
                        case 3:
                            oItem.MAKTX = sNewValue;
                            break;
                        case 4:

                            var table = this.getView().byId("ItemData");
                            var rows = table.getItems();
                            // var oModel = this.getView().getModel("lineItemModel");
                            var oItem = oModel.getProperty(sPath);
                            var that = this;

                            rows.forEach(function (row) {
                                debugger;
                                var cells = row.getCells();
                                var ro = row.sId;
                                var rowCount = ro.charAt(ro.length - 1);
                                var path = sPath.charAt(sPath.length - 1);
                                if (rowCount == path) {
                                    cells.forEach(function (cell) {
                                        debugger;
                                        // if(cell.mProperties.text == sPath.charAt(sPath.length - 1)){
                                        if (cell instanceof sap.m.Input) { // Check if the cell is an input field
                                            if (sModelName == 'GPDetailsModel') {
                                                var originalValue = oItem.QUANTITY;
                                            } else if (sModelName == 'lineItemModel') {
                                                var originalValue = oItem.MENGE;
                                            }

                                            var newValue = cell.getValue()

                                            that.validateInput(cell, newValue, originalValue);
                                            that.updateDataLocally(path, newValue);


                                        }

                                    });
                                }
                            });

                            break;
                        case 5:
                            oItem.MEINS = sNewValue;
                            break;
                    }
                } else if (selectedKey === 'SHIP') {
                    switch (iColumnIndex) {
                        case 1:
                            oItem.TKNUM = sNewValue;
                            break;
                        case 2:
                            oItem.VBELN = sNewValue;
                            break;
                        case 3:
                            oItem.SHTYP = sNewValue;
                            break;
                        case 4:

                            var table = this.getView().byId("ItemData");
                            var rows = table.getItems();
                            // var oModel = this.getView().getModel("lineItemModel");
                            var oItem = oModel.getProperty(sPath);
                            var that = this;

                            rows.forEach(function (row) {
                                debugger;
                                var cells = row.getCells();
                                var ro = row.sId;
                                var rowCount = ro.charAt(ro.length - 1);
                                var path = sPath.charAt(sPath.length - 1);
                                if (rowCount == path) {
                                    cells.forEach(function (cell) {
                                        debugger;
                                        // if(cell.mProperties.text == sPath.charAt(sPath.length - 1)){
                                        if (cell instanceof sap.m.Input) { // Check if the cell is an input field
                                            if (sModelName == 'GPDetailsModel') {
                                                var originalValue = oItem.QUANTITY;
                                            } else if (sModelName == 'lineItemModel') {
                                                var originalValue = oItem.LAUFK;
                                            }
                                            var newValue = cell.getValue()

                                            that.validateInput(cell, newValue, originalValue);
                                            that.updateDataLocally(path, newValue);


                                        }

                                    });
                                }
                            });
                            // oItem.LAUFK = sNewValue;
                            break;
                        case 5:
                            oItem.DTMEG = sNewValue;
                            break;
                    }
                } else if (selectedKey === 'SDC') {
                    switch (iColumnIndex) {
                        case 1:
                            oItem.VBELN = sNewValue;
                            break;
                        case 2:
                            oItem.MATNR = sNewValue;
                            break;
                        case 3:
                            oItem.ARKTX = sNewValue;
                            break;
                        case 4:

                            var table = this.getView().byId("ItemData");
                            var rows = table.getItems();
                            // var oModel = this.getView().getModel("lineItemModel");
                            var oItem = oModel.getProperty(sPath);
                            var that = this;

                            rows.forEach(function (row) {
                                debugger;
                                var cells = row.getCells();
                                var ro = row.sId;
                                var rowCount = ro.charAt(ro.length - 1);
                                var path = sPath.charAt(sPath.length - 1);
                                if (rowCount == path) {
                                    cells.forEach(function (cell) {
                                        debugger;
                                        // if(cell.mProperties.text == sPath.charAt(sPath.length - 1)){
                                        if (cell instanceof sap.m.Input) { // Check if the cell is an input field
                                            if (sModelName == 'GPDetailsModel') {
                                                var originalValue = oItem.QUANTITY;
                                            } else if (sModelName == 'lineItemModel') {
                                                var originalValue = oItem.LFIMG;
                                            }
                                            var newValue = cell.getValue()

                                            that.validateInput(cell, newValue, originalValue);
                                            that.updateDataLocally(path, newValue);


                                        }

                                    });
                                }
                            });
                            // oItem.LAUFK = sNewValue;
                            break;
                        case 5:
                            oItem.MEINS = sNewValue;
                            break;
                    }
                }

                // Set the updated array back to the model
                oModel.setProperty(sPath, aItems);

                // Refresh the model to reflect the changes in the UI
                oModel.refresh(true);
            },



            isPropertyPresent: function (array, propertyName) {
                for (var i = 0; i < array.length; i++) {
                    if (propertyName in array[i]) {
                        return true; // If property found, return true immediately
                    }
                }
                return false; // If property not found in any object, return false
            },

            onBtnChkOut: function () {

                var currentDate = new Date();

                // Get individual components of the current date and time
                var currentYear = currentDate.getFullYear();
                var currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
                var currentDay = currentDate.getDate();
                var currentHours = currentDate.getHours();
                var currentMinutes = currentDate.getMinutes();
                var currentSeconds = currentDate.getSeconds();

                // Format the date and time components as needed
                var formatDate = currentYear + "-" + (currentMonth < 10 ? "0" : "") + currentMonth + "-" + (currentDay < 10 ? "0" : "") + currentDay;
                var formatTime = (currentHours < 10 ? "0" : "") + currentHours + ":" + (currentMinutes < 10 ? "0" : "") + currentMinutes + ":" + (currentSeconds < 10 ? "0" : "") + currentSeconds;
                this.getView().byId("checkOutDate").setValue(formatDate);
                this.getView().byId("checkOutTime").setValue(formatTime);
            },

            exceededQuantity: false,
            updateData: function () {
                debugger;
                this.exceededQuantity = false;
                this.editable = false;
                let that = this;
                this.getView().getModel('gpData').refresh(true);
                var GPDetailsModel1 = this.getView().getModel("GPDetailsModel");
               
                if (this.check == 1) {
                    let GPDetailsModel = this.getView().getModel("GPDetailsModel");

                    if (GPDetailsModel) {

                        this.selectedKey = GPDetailsModel.getProperty("/REF_TYPE");
                        var selectedKey = this.getView().byId("referencesType").getSelectedKey();
                        if (this.counter === 1) {


                            if (this.selectedKey === selectedKey) {

                            } else {
                                this.getView().getModel('gpData').setProperty("/REF_TYPE", this.selectedKey);
                            }
                        } else if (this.selectedKey === selectedKey) {

                        } else {
                            this.getView().getModel('gpData').setProperty("/REF_TYPE", selectedKey);
                        }
                    }

                }
                var gpCreationData = this.getView().getModel('gpData').getData();
                this.objPostData = gpCreationData;
                let selected = this.getView().byId("GPType").getSelectedKey();
                
                this.objPostData.GP_Type = selected;
                var oModel = this.getView().getModel('lineItemModel');
                debugger;
                if (!oModel) {
                    var model = this.getView().getModel("GPDetailsModel");
                    var currentData = model.getData(); // for updated data
                    var data = model.getData();
                    var oModel = this.getView().setModel(model, 'lineItemModel');
                    var Ref_Type = this.objPostData.REF_TYPE;


                    var arrayData = data.ITEMS;
                    if (Ref_Type === "PO" && this.isPropertyPresent(arrayData, 'EBELN')) {
                        // var model = this.getView().getModel("GPDetailsModel");
                        // var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                                
                                if(parseInt(newValue) > record.MENGE){
                                    that.exceededQuantity = true;

                                }else{
                                    record.MENGE = parseInt(newValue);
                                }// Adjust quantityField with the actual field name in your model
                            }
                        });



                        this.getView().getModel('lineItemModel').setData(data);
                       
                    }  else if (Ref_Type === "SHIP" && this.isPropertyPresent(arrayData, 'TKNUM')) {
                        // var model = this.getView().getModel("GPDetailsModel");
                        // var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                               
                                if(parseInt(newValue) > record.LAUFK){
                                    that.exceededQuantity = true;

                                }else{
                                    record.LAUFK = parseInt(newValue);
                                }
                            }
                                    
                        });


                        this.getView().getModel('lineItemModel').setData(data);
                        
                    } else if (Ref_Type === "SDC" && this.isPropertyPresent(arrayData, 'VBELN')) {
                        // var model = this.getView().getModel("GPDetailsModel");
                        // var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                               
                                if(parseInt(newValue) > record.LFIMG){
                                    that.exceededQuantity = true;

                                }else{
                                    record.LFIMG = parseInt(newValue);
                                }
                            }
                                    
                        });


                        this.getView().getModel('lineItemModel').setData(data);
                        
                    }
                    else if (Ref_Type === "SHIP"|| Ref_Type === "PO" || Ref_Type === "SDC" && this.isPropertyPresent(arrayData, 'QUANTITY')) {
                        debugger;
                        // var model = this.getView().getModel("GPDetailsModel");
                        // var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                               
                                if(parseInt(newValue) > record.QUANTITY){
                                    that.exceededQuantity = true;

                                }else{
                                    record.QUANTITY = parseInt(newValue);
                                }
                                   
                                     
                            }
                        });


                        this.getView().getModel('lineItemModel').setData(data);
                        
                    }


                    this.getView().getModel('lineItemModel').setData(data);
                    //    var oItems = this.getView().getModel('lineItemModel').getData().ITEMS;
                }
                else {
                    var currentData = oModel.getData(); // for updated data
                    var Ref_Type = this.objPostData.REF_TYPE;
                    if (Ref_Type === undefined) {
                        Ref_Type = this.getView().byId("referencesType").getSelectedKey();
                    }
                    var data = oModel.getData();

                    var arrayData = data.ITEMS;
                    if (Ref_Type === "PO" && !this.isPropertyPresent(arrayData, 'EBELN')) {
                        var model = this.getView().getModel("GPDetailsModel");
                        var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if(record){
                            if(parseInt(newValue) > record.MENGE){
                                that.exceededQuantity = true;

                            }else{
                                record.MENGE = parseInt(newValue);
                            }
                        }
                        });



                        this.getView().getModel('lineItemModel').setData(data);
                        
                    } else if (Ref_Type === "GP" || Ref_Type === "OT" && !this.isPropertyPresent(arrayData, 'ITEM_NO')) {
                        var model = this.getView().getModel("GPDetailsModel");
                        var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        this.getView().getModel('lineItemModel').setData(data);
                    } else if (Ref_Type === "SHIP" && !this.isPropertyPresent(arrayData, 'TKNUM')) {
                        var model = this.getView().getModel("GPDetailsModel");
                        var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                               
                               
                                if(parseInt(newValue) > record.LAUFK){
                                    that.exceededQuantity = true;

                                }else{
                                    record.LAUFK = parseInt(newValue);
                                }
                            }
                        });


                        this.getView().getModel('lineItemModel').setData(data);
                       
                    } else if (Ref_Type === "SDC" && !this.isPropertyPresent(arrayData, 'VBELN')) {
                        var model = this.getView().getModel("GPDetailsModel");
                        var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                               
                               
                                if(parseInt(newValue) > record.LFIMG){
                                    that.exceededQuantity = true;

                                }else{
                                    record.LFIMG = parseInt(newValue);
                                }
                            }
                        });


                        this.getView().getModel('lineItemModel').setData(data);
                       
                    }
                    else if (Ref_Type === "SHIP"|| Ref_Type === "PO" || Ref_Type === "SDC" && !this.isPropertyPresent(arrayData, 'QUANTITY')) {
                        debugger;
                        var model = this.getView().getModel("GPDetailsModel");
                        var data = model.getData();
                        // var oModel = this.getView().setModel(model, 'lineItemModel');

                        Object.keys(that.updatedData).forEach(function (rowno) {
                            debugger;
                            var newValue = that.updatedData[rowno];
                            // Update the corresponding record in currentData
                            var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                            if (record) {
                                // Update the quantity field with newValue
                               
                                
                                if(parseInt(newValue) > record.QUANTITY){
                                    that.exceededQuantity = true;

                                }else{
                                    record.QUANTITY = parseInt(newValue);
                                }// Adjust quantityField with the actual field name in your model
                               
                            }
                        });


                        this.getView().getModel('lineItemModel').setData(data);
                       
                    }

                    

                }
                console.log(gpCreationData);

                // var selectedKey = this.getView().byId("referencesType").getSelectedKey();

                // if (selectedKey == 'PO' || selectedKey == 'SHIP') {
                //     debugger;
                //     // var oModel = this.getView().getModel("GPDetailsModel");
                //     // if (!oModel) {
                //     //     var oModel1 = this.getView().getModel("lineItemModel");
                //     //     var currentData = oModel1.getData();
                //     // } else {
                //     //     var currentData = oModel.getData();
                //     // }

                //     Object.keys(that.updatedData).forEach(function (rowno) {
                //         debugger;
                //         var newValue = that.updatedData[rowno];
                //         // Update the corresponding record in currentData
                //         var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                //         if (record) {
                //             // Update the quantity field with newValue
                //             if (selectedKey == 'PO' && oModel) {
                //                 record.MENGE = parseInt(newValue); // Adjust quantityField with the actual field name in your model
                //             } else if (selectedKey == 'PO' && model) {
                //                 record.QUANTITY = parseInt(newValue); // Adjust quantityField with the actual field name in your model
                //             }
                //             else if (selectedKey == 'SHIP' && oModel) {
                //                 record.LAUFK = parseInt(newValue);
                //             } else if (selectedKey == 'SHIP' && model) {
                //                 record.QUANTITY = parseInt(newValue); // Adjust quantityField with the actual field name in your model
                //             }
                //         }
                //     });

                //     // Set the updated data back to the model
                //     if(oModel){
                //         oModel.setData(currentData);
                //     }else if (model){
                //         model.setData(currentData);
                //     }
                    
                //     that.updatedData = {};
                // }



                var oTable = this.getView().byId("ItemData");

                
                var aItems = oTable.getItems();
                

                
                var V = this.Validator();
                if (V === true) {

                    var Ref_Type = this.objPostData.REF_TYPE;
                    // oModel.refresh(true);
                    if (aItems.length > 0) {
                        var oItems = this.getView().getModel('lineItemModel').getData().ITEMS;
                    }
                    if (oItems == undefined) {
                        MessageToast.show("Please Enter Item Details!")
                    }

                    var table = this.getView().byId("ItemData");
                    var rows = table.getItems();
                    var isEmpty = false;

                    rows.forEach(function (row) {
                        var cells = row.getCells();
                        cells.forEach(function (cell) {
                            if (cell instanceof sap.m.Input) { // Check if the cell is an input field
                                var value = cell.getValue();
                                if (!value) {
                                    isEmpty = true;
                                    cell.setValueState(sap.ui.core.ValueState.Error);
                                } else {
                                    cell.setValueState(sap.ui.core.ValueState.None);
                                }
                            }
                        });
                    });

                    if (isEmpty) {
                        sap.m.MessageToast.show("Please fill in all fields.");
                    } else {

                        if (that.exceededQuantity == true) {
                            sap.m.MessageToast.show("New value cannot be greater than the original quantity.");
                            that.getView().setModel(null,"lineItemModel");
                            return; // Stop the execution of the function
                        }


                        // var selectedKey = this.getView().byId("referencesType").getSelectedKey();

                        // if (selectedKey == 'PO' || selectedKey == 'SHIP') {
                        //     debugger;
                        //     // var oModel = this.getView().getModel("GPDetailsModel");
                        //     // if (!oModel) {
                        //     //     var oModel1 = this.getView().getModel("lineItemModel");
                        //     //     var currentData = oModel1.getData();
                        //     // } else {
                        //     //     var currentData = oModel.getData();
                        //     // }

                        //     Object.keys(that.updatedData).forEach(function (rowno) {
                        //         debugger;
                        //         var newValue = that.updatedData[rowno];
                        //         // Update the corresponding record in currentData
                        //         var record = currentData['ITEMS'][rowno]; // Assuming rowno is the key for each record
                        //         if (record) {
                        //             // Update the quantity field with newValue
                        //             if (selectedKey == 'PO' && oModel) {
                        //                 record.MENGE = parseInt(newValue); // Adjust quantityField with the actual field name in your model
                        //             } else if (selectedKey == 'PO' && model) {
                        //                 record.QUANTITY = parseInt(newValue); // Adjust quantityField with the actual field name in your model
                        //             }
                        //             else if (selectedKey == 'SHIP' && oModel) {
                        //                 record.LAUFK = parseInt(newValue);
                        //             } else if (selectedKey == 'SHIP' && model) {
                        //                 record.QUANTITY = parseInt(newValue); // Adjust quantityField with the actual field name in your model
                        //             }
                        //         }
                        //     });

                        //     // Set the updated data back to the model
                        //     if(oModel){
                        //         oModel.setData(currentData);
                        //     }else if (model){
                        //         model.setData(currentData);
                        //     }
                            
                        //     that.updatedData = {};
                        // }



                        that.objPostData.ITEMS = [];
                        if (Ref_Type === "PO" && this.check == 0) {
                            oItems.forEach(function (obj) {
                                var objItem = {
                                    "ITEM_NO": obj.EBELP,
                                    "REF_DOC": obj.EBELN,
                                    "MATERIAL_NO": obj.MATNR,
                                    "MATERIAL_DES": obj.MAKTX,
                                    "QUANTITY": obj.MENGE,
                                    "UOM": obj.MEINS
                                }

                                that.objPostData.ITEMS.push(objItem);

                            });
                        } else if (Ref_Type === "SHIP" && this.check == 0) {

                            oItems.forEach(function (obj) {
                                var objItem = {
                                    "ITEM_NO": obj.TPNUM,
                                    "REF_DOC": obj.TKNUM,
                                    "MATERIAL_NO": obj.VBELN,
                                    "MATERIAL_DES": obj.SHTYP,
                                    "QUANTITY": obj.LAUFK,
                                    "UOM": obj.DTMEG
                                }

                                that.objPostData.ITEMS.push(objItem);

                            });



                        } else if (Ref_Type === "SDC" && this.check == 0) {

                            oItems.forEach(function (obj) {
                                var objItem = {
                                    "ITEM_NO": obj.POSNR,
                                    "REF_DOC": obj.VBELN,
                                    "MATERIAL_NO": obj.MATNR,
                                    "MATERIAL_DES": obj.ARKTX,
                                    "QUANTITY": obj.LFIMG,
                                    "UOM": obj.MEINS
                                }

                                that.objPostData.ITEMS.push(objItem);

                            });



                        } 
                        else if (Ref_Type === "GP" || Ref_Type === "OT" || Ref_Type === "PO" || Ref_Type === "SHIP" || Ref_Type === "SDC") {
                            debugger;

                            oItems.forEach(function (obj) {
                                var objItem = {
                                    "ITEM_NO": obj.ITEM_NO,
                                    "REF_DOC": obj.REF_DOC,
                                    "MATERIAL_NO": obj.MATERIAL_NO,
                                    "MATERIAL_DES": obj.MATERIAL_DES,
                                    "QUANTITY": obj.QUANTITY,
                                    "UOM": obj.UOM
                                }

                                that.objPostData.ITEMS.push(objItem);

                            });

                        }
                        
                        var console1 = 0;
                        if (this.isEditMode === true && (Ref_Type === "OT" || Ref_Type === "PO" || Ref_Type === "SHIP" || Ref_Type === "SDC")) {
                            MessageToast.show("Please Save the Table records!");
                            return;
                        } else {
                            debugger;
                            datamanager.updateData(that.objPostData, function (success) {
                                console.log(success);
                                MessageToast.show("Data Updated Succesfully!");
                            }, function (error) {
                                console.log(error);
                            });
                            that.updatedData = {};
                            this.getView().setModel(null, "lineItemModel");
                            this.onAction();
                            this.isEditMode = '';
                            var v = this.getView().getModel('GPDetailsModel')
                            if (v) {
                                v.setData("");
                            }
                            console1 = 1;
                        }

                        var btnChkOut = that.getView().byId("btnChkOut");
                        btnChkOut.setVisible(false);

                        if (console1 === 0) {

                            this.getView().setModel(GPDetailsModel1, "lineItemModel");
                            //     var can1 = this.getView().getModel("lineItemModel");

                            var oTable = this.getView().byId("ItemData");
                            // oTable.setModel(GPDetailsModel1, "lineItemModel");
                            if (Ref_Type === "OT"){
                            var oTemplate = new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.Input({ value: "{lineItemModel>ITEM_NO}", enabled: true }), // Replace "ITEM_NO" with your actual property names
                                    new sap.m.Input({ value: "{lineItemModel>REF_DOC}", enabled: true }),
                                    new sap.m.Input({ value: "{lineItemModel>MATERIAL_NO}", enabled: true }),
                                    new sap.m.Input({ value: "{lineItemModel>MATERIAL_DES}", enabled: true }), // Replace "ITEM_NO" with your actual property names
                                    new sap.m.Input({ value: "{lineItemModel>QUANTITY}", enabled: true }),
                                    new sap.m.Input({ value: "{lineItemModel>UOM}", enabled: true }),
                                ]
                            });
                        } else{
                            var oTemplate = new sap.m.ColumnListItem({
                                cells: [
                                    new sap.m.Input({ value: "{lineItemModel>ITEM_NO}", enabled: false }), // Replace "ITEM_NO" with your actual property names
                                    new sap.m.Input({ value: "{lineItemModel>REF_DOC}", enabled: false }),
                                    new sap.m.Input({ value: "{lineItemModel>MATERIAL_NO}", enabled: false }),
                                    new sap.m.Input({ value: "{lineItemModel>MATERIAL_DES}", enabled: false }), // Replace "ITEM_NO" with your actual property names
                                    new sap.m.Input({ value: "{lineItemModel>QUANTITY}", enabled: true }),
                                    new sap.m.Input({ value: "{lineItemModel>UOM}", enabled: false }),
                                ]
                            });
                        }

                            oTable.bindItems({
                                path: "lineItemModel>/ITEMS",
                                template: oTemplate
                            });
                        }

                        // 
                        // console.log(console1);

                    }
                }

            },

            popclose: function (choice) {
                let oModel = this.getView().getModel("GPDetailsModel");
                if (choice === 'OK') {
                    MessageToast.show("Data Deleted Succesfully!", {
                        duration: 3000
                    });
                    oModel.setData("");
                    this.onAction();
                }
            },


            deleteData: function () {
                debugger;

                let docValue = this.getView().byId('gatepassNum').getValue();
                // let oModel = this.getView().getModel("GPDetailsModel");

                if (docValue.trim() === '') {
                    MessageToast.show("Please select Gate Pass No to Delete");
                    return; // Stop execution if no gatepass number is provided
                }

                let oController = this; // Capture the current controller instance

                MessageBox.confirm("Do you want to Delete ?", {
                    styleClass: "sapUiSizeCompact",
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {
                            let oObject = {
                                Number: docValue
                            };

                            datamanager.deleteData(oObject, function (success) {
                                console.log(success);
                                oController.popclose('OK'); // Trigger success message using the captured controller instance
                                // oController.getView().byId('gatepassNum').setValue('');

                            }, function (error) {
                                console.log(error);
                            });
                        } else {
                            // User clicked Cancel or closed the dialog
                            MessageToast.show("Delete operation canceled");
                        }
                    }
                });

            }
        });
    }
);
