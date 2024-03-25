sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "gatepass/gatepass/utils/datamanager",
    
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, datamanager) {
        "use strict";

        return Controller.extend("gatepass.gatepass.controller.GPReport", {
            objGetData: {
                Table: ''
            },
            searchResponse: {
                data: []
            },
            f4Help: {
                arrF4Data: [],
                custData: [],
                suppData: [],
                matData: [],
                ITEMS: []
            },
            lineItem: {
                ITEMS: []
            },
            onInit: function () {

                // sap.ui.getCore().applyTheme('sap_belize_plus');
                var that = this;

                var sImagePath = sap.ui.require.toUrl("gatepass/gatepass/Images/TMCLogo_favicon.png");
                this.getView().byId("GPImage").setSrc(sImagePath);

                datamanager.getGPReport(function (response) {
                    debugger;
                    that.objGetData.Table = JSON.parse(response.EvJson);
                    var oModelGP = new sap.ui.model.json.JSONModel(that.objGetData);
                    that.getView().setModel(oModelGP, "oModelGP");
                })

                // var oTable = this.byId("Tableid");
                
                // oTable.setRowMode('Interactive');

            },

            zdialog: "",

            _ParentValueHelpSearch: function (oEvent) {
                var zdialog;
                debugger;



                var searchQuery = oEvent.getParameter("value");
                if (oEvent.mParameters.id.includes('GP')) {
                    var data = 'GP_NO';
                    zdialog = this.newGateDialog1;

                } else if (oEvent.mParameters.id.includes('PO')) {
                    var data = 'EBELN';
                    zdialog = this.newRefdocDialog1;
                } else if (oEvent.mParameters.id.includes('SHIP')) {
                    var data = 'TKNUM';
                    zdialog = this.newRefdocDialog2;
                } else if (oEvent.mParameters.id.includes('MN')) {
                    var data = 'MATNR';
                    zdialog = this.newRefdocDialog3;
                } else if (oEvent.mParameters.id.includes('VN')) {
                    var data = 'VEHICLE_NO';
                    zdialog = this.newRefdocDialog4;
                }

                this.zdialog = zdialog;

                if (!searchQuery) {

                    this.clearFilters();
                } else {
                    this.clearFilters();
                    var filters = [];
                    if (!isNaN(searchQuery)) {
                        filters.push(new Filter(data, FilterOperator.EQ, parseInt(searchQuery)));
                    }

                    var mainFilter = new Filter({ filters: filters, and: false });
                    this.applyFilter(mainFilter, this.zdialog);
                }
            },

            clearFilters: function () {
                this.applyFilter(null, this.zdialog); // Clear all filters
            },
            that: this,


            applyFilter: function (filter, zdialog) {
                debugger;
                // var that = this;
                // zdialog.setBindingContext(null);


                var oListBinding = zdialog.getBinding("items");

                if (oListBinding) {
                    oListBinding.filter(filter);

                } else {
                    console.error("List binding not found!");
                }
                // zdialog.destroy();
                // zdialog = null;
            },


            gatePassFragment: function (evt) {
                debugger;

                let that = this;
                // this.data();
                var field = evt.mParameters.id;

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
                            that.newGateDialog1 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Gatepass", that);
                            var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                            that.newGateDialog1.setModel(oModel);
                            // this.newGateDialog1.getModel().refresh(true);
                        } else {
                            that.newGateDialog1.sId = field;
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
                var selected = evt.mParameters.id;
                // var dd = sap.ui.core.Fragment.byId("gp");

                if (oSelectedItem && selected.includes("initialGP")) {

                    var productInput1 = this.byId("initialGP");

                    var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    productInput1.setValue(oPrnr1);
                    productInput1.setValue(oName1);
                    this.oninitialGPChange();

                } else if (oSelectedItem && selected.includes("finalGP") && this.byId("initialGP").getValue()) {

                    var finalGPValue = oSelectedItem[0].getDescription();
                    var initialGPValue = this.byId("initialGP").getValue();

                    if (initialGPValue > finalGPValue) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset final value or take necessary action
                        this.byId("finalGP").setValue("");
                        return;
                    }

                    var productInput1 = this.byId("finalGP");
                    productInput1.setValue(finalGPValue);
                    this.onfinalGPChange();
                }

                // evt.getSource().getBinding("items").filter([]);

            },


            
            refDocFragment: function (evt) {
                debugger;
                let that = this;
                var field = evt.mParameters.id;
                // this.evnt = evt;
                if (field.includes('PO')) {
                    var object = {

                        Key: 'PO'
                    }
                } else if (field.includes('VN')) {
                    var object = {

                        Key: 'GP'
                    }
                } else if (field.includes('SHIP')) {
                    var object = {

                        Key: 'SHIP'
                    }
                } else if (field.includes('MN')) {
                    var object = {

                        Key: 'MN'
                    }
                }





                datamanager.getF4HelpData(object, function (response) {

                    //set response data in global object
                    debugger;
                    that.searchResponse.data = response.Value;

                    if (that.searchResponse.data.length > 0) {



                        debugger;
                        if (field.includes('PO')) {
                            if (field.includes("initialPO") || field.includes("finalPO")) {
                                that.f4Help.ITEMS = JSON.parse(response.Value);
                                console.log(that.f4Help.ITEMS);
                                debugger;
                                if (that.newRefdocDialog1) {
                                    that.newRefdocDialog1.destroy();
                                    that.newRefdocDialog1 = null;
                                }

                                if (!that.newRefdocDialog1) {

                                    that.newRefdocDialog1 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    debugger;
                                    var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
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


                            }
                        } if (field.includes('SHIP')) {
                            if (field.includes("initialSHIP") || field.includes("finalSHIP")) {
                                that.f4Help.ITEMS = JSON.parse(response.Value);
                                console.log(that.f4Help.ITEMS);

                                if (that.newRefdocDialog2) {
                                    that.newRefdocDialog2.destroy();
                                    that.newRefdocDialog2 = null;
                                }

                                if (!that.newRefdocDialog2) {

                                    that.newRefdocDialog2 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
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
                                }
                                that.newRefdocDialog2.getModel().refresh(true);
                                that.newRefdocDialog2.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog2.open();

                            }
                        } if (field.includes('MN')) {
                            if (field.includes("initialMN") || field.includes("finalMN")) {
                                that.f4Help.ITEMS = JSON.parse(response.Value);
                                console.log(that.f4Help.ITEMS);

                                if (that.newRefdocDialog3) {
                                    that.newRefdocDialog3.destroy();
                                    that.newRefdocDialog3 = null;
                                }

                                if (!that.newRefdocDialog3) {

                                    that.newRefdocDialog3 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                                    //oModel.setData(arrF4Data);
                                    that.newRefdocDialog3.setModel(oModel, 'oModel');
                                    // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                    that.getView().addDependent(that.newRefdocDialog3); //addDependent to access the model in fragment
                                    that.newRefdocDialog3.bindAggregation("items", {
                                        path: "oModel>/ITEMS",
                                        template: new sap.m.StandardListItem({
                                            title: "Material Number",
                                            description: "{oModel>MATNR}"
                                        })

                                    });


                                } else {
                                    that.newRefdocDialog3.sId = field;
                                }
                                that.newRefdocDialog3.getModel().refresh(true);
                                that.newRefdocDialog3.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog3.open();

                            }
                        } if (field.includes('VN')) {
                            if (field.includes("initialVN")) {
                                that.f4Help.ITEMS = JSON.parse(response.Value);
                                console.log(that.f4Help.ITEMS);

                                if (that.newRefdocDialog4) {
                                    that.newRefdocDialog4.destroy();
                                    that.newRefdocDialog4 = null;
                                }

                                if (!that.newRefdocDialog4) {

                                    that.newRefdocDialog4 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                    // console.log(this.newRefdocDialog1);
                                    var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                                    //oModel.setData(arrF4Data);
                                    that.newRefdocDialog4.setModel(oModel, 'oModel');
                                    // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                    that.getView().addDependent(that.newRefdocDialog4); //addDependent to access the model in fragment
                                    that.newRefdocDialog4.bindAggregation("items", {
                                        path: "oModel>/ITEMS",
                                        template: new sap.m.StandardListItem({
                                            title: "Vehicle Number",
                                            description: "{oModel>VEHICLE_NO}"
                                        })

                                    });


                                } else {
                                    that.newRefdocDialog4.sId = field;
                                }
                                that.newRefdocDialog4.getModel().refresh(true);
                                that.newRefdocDialog4.attachConfirm(that.onConfirm, that);
                                that.newRefdocDialog4.open();

                            }
                        }
                    }

                });

            },




            // this.newRefdocDialog1.open();





            selectRefDoc: function (evt) {
                debugger;

                var oSelectedItem = evt.mParameters.selectedItems;
                var selected = evt.mParameters.id;

                if (oSelectedItem && selected.includes("initialPO")) {

                    var productInput1 = this.byId("initialPO");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);
                    this.oninitialPOChange();

                } else if (oSelectedItem && selected.includes("finalPO") && this.byId("initialPO").getValue()) {
                    var finalPOValue = oSelectedItem[0].getDescription();
                    var initialPOValue = this.byId("initialPO").getValue();

                    if (initialPOValue > finalPOValue) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset final value or take necessary action
                        this.byId("finalPO").setValue("");
                        return;
                    }

                    var productInput1 = this.byId("finalPO");
                    productInput1.setValue(finalPOValue);
                    this.onfinalPOChange();
                }

                if (oSelectedItem && selected.includes("initialSHIP")) {

                    var productInput1 = this.byId("initialSHIP");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);
                    this.oninitialSHIPChange();

                } else if (oSelectedItem && selected.includes("finalSHIP") && this.byId("initialSHIP").getValue()) {
                    var finalSHIPValue = oSelectedItem[0].getDescription();
                    var initialSHIPValue = this.byId("initialSHIP").getValue();

                    if (initialSHIPValue > finalSHIPValue) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset final value or take necessary action
                        this.byId("finalSHIP").setValue("");
                        return;
                    }

                    var productInput1 = this.byId("finalSHIP");
                    productInput1.setValue(finalSHIPValue);
                    this.onfinalSHIPChange();
                }

                if (oSelectedItem && selected.includes("initialMN")) {

                    var productInput1 = this.byId("initialMN");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);
                    this.oninitialMNChange();

                } else if (oSelectedItem && selected.includes("finalMN") && this.byId("initialMN").getValue()) {
                    var finalMNValue = oSelectedItem[0].getDescription();
                    var initialMNValue = this.byId("initialMN").getValue();

                    if (initialMNValue > finalMNValue) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset final value or take necessary action
                        this.byId("finalMN").setValue("");
                        return;
                    }

                    var productInput1 = this.byId("finalMN");
                    productInput1.setValue(finalMNValue);
                    this.onfinalMNChange();
                }

                if (oSelectedItem && selected.includes("initialVN")) {

                    var productInput1 = this.byId("initialVN");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);
                    this.oninitialVNChange();

                }
                // evt.getSource().getBinding("items").filter([]);

            },









            onSearchIconPress: function () {
                var oSearchField = this.getView().byId("searchField");
                oSearchField.setVisible(!oSearchField.getVisible());

                if (oSearchField.getVisible()) {
                    oSearchField.focus(); // Optionally, focus on the search field when it becomes visible.
                }
            },

            onSearchFieldLiveChange: function (oEvent) {
                // debugger;
                var sQuery = oEvent.getSource().getValue().trim(); // Trim any leading or trailing spaces
                var oTable = this.getView().byId("Tableid");
                // var sQuery = oEvent.getSource().getValue().trim();
                // var oTable = this.byId("Tableid");
                var oBinding = oTable.getBinding("rows");

                if (sQuery === "") {
                    oBinding.filter([]); // Clear existing filters
                    return;
                }

                var aFilters = [];

                var oParsedDate = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-DD" }).parse(sQuery);
                if (oParsedDate) {
                    // Treat it as a date
                    debugger;
                    var aFields = [
                        "CHECKIN_DATE", "CHECKOUT_DATE",
                        "DELIV_CHALLAN_DATE", "EXP_DELIV_DATE"
                    ];
                    aFields.forEach(function (fieldName) {
                        aFilters.push(new Filter(fieldName, FilterOperator.EQ, oParsedDate)); // Replace "DateField" with the actual name of your date field
                    })
                } else {
                    // Check if the query can be parsed as a time
                    var oParsedTime = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).parse(sQuery);
                    if (oParsedTime) {
                        var aFields = [
                            "CHECKIN_TIME", "CHECKOUT_TIME",
                            "EXIT_TIME"
                        ];
                        aFields.forEach(function (fieldName) {
                            aFilters.push(new Filter(fieldName, FilterOperator.EQ, oParsedTime));
                        })
                    }
                }

                // Check if the query is a valid number
                if (!isNaN(sQuery)) {
                    // Treat it as a number
                    var aFields = [
                        "GP_NO", "REF_DOC", "DRIVER_NIC", "DRIVER_CONTACT", "DRIVER_CHALLAN", "VEHICLE_NO", "TRUCK_RECPT_NO",
                        "EXIT_TIME", "CHECKIN_DATE", "CHECKIN_TIME", "CHECKOUT_DATE", "CHECKOUT_TIME",
                        "DELIV_CHALLAN_DATE", "EXP_DELIV_DATE"
                    ];

                    // Iterate over the fields and push filters into the aFilters array
                    aFields.forEach(function (fieldName) {
                        aFilters.push(new Filter(fieldName, FilterOperator.EQ, parseInt(sQuery))); // Assuming sQuery is defined
                    });
                } else {
                    // Treat it as a string
                    var aFilterFields = [
                        "CITYOFFICE", "RETURNABLE", "REF_TYPE",
                        "DRIVER_NAME", "REASON", "REMARKS", "CUSTOMER",
                        "SUPPLIER", "GATE_INCHARGE",
                        "MOT", "TRANSPORT", "DEPARTMENT", "DESCRIPTION", "DESTINATION",

                    ];

                    aFilterFields.forEach(function (sField) {
                        var oFilter = new Filter(sField, FilterOperator.Contains, sQuery);
                        aFilters.push(oFilter);
                    });
                }

                var oCombinedFilter = new Filter({
                    filters: aFilters,
                    and: false // Set to true for AND condition, false for OR condition
                });

                oBinding.filter(oCombinedFilter);
            },


            onFilterIconPress: function () {
                debugger;
                var oFilterBar = this.byId("filterBar");
                var bFilterBarVisible = oFilterBar.getVisible();
                // var bDropdownVisible = oFilterBar.getFilterGroupItems().length > 0;

                oFilterBar.setVisible(!bFilterBarVisible);
                // oClearFilterButton.setVisible(!bFilterBarVisible);

                // Toggle dropdown list visibility only if there are filter group items
                // if (bDropdownVisible) {
                //     var oDropdown = oFilterBar._oBasicSearchField.getPicker();
                //     if (oDropdown) {
                //         oDropdown.toggle();
                //     }
                // }
            },

            onClearFilters: function () {
                debugger;
                var oTable = this.byId("Tableid");
                var oBinding = oTable.getBinding("rows");


                oBinding.filter([]);
                this.getView().byId("startDateInput").setValue("");
                this.getView().byId("endDateInput").setValue("");
                this.getView().byId("initialGP").setValue("");
                this.getView().byId("finalGP").setValue("");
                this.getView().byId("initialPO").setValue("");
                this.getView().byId("finalPO").setValue("");
                this.getView().byId("initialMN").setValue("");
                this.getView().byId("finalMN").setValue("");
                this.getView().byId("initialSHIP").setValue("");
                this.getView().byId("finalSHIP").setValue("");
                this.getView().byId("initialVN").setValue("");


            },


            onFilterChange: function () {
                debugger;
                var aFilters = this.getFiltersWithValues().map(function (oFilterGroupItem) {
                    return new Filter({
                        path: oFilterGroupItem.getName(),
                        operator: FilterOperator.EQ,
                        value1: oFilterGroupItem.getControl().getSelectedKeys().join(',')
                    });
                });

                var oTable = this.getView().byId("Tableid");
                var oBinding = oTable.getBinding("rows");
                oBinding.filter(aFilters);
            },

            getFiltersWithValues: function () {
                var aFiltersWithValue = this.byId("filterBar").getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();

                    if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                        aResult.push(oFilterGroupItem);
                    }

                    return aResult;
                }, []);

                return aFiltersWithValue;
            },

            onSortIconPress: function () {
                debugger;
                var oTable = this.getView().byId("Tableid");
                var oBinding = oTable.getBinding("rows");
                var sPath = "GP_NO"; // Property name for sorting
                var bDescending = oBinding.aSorters.some(function (sorter) {
                    return sorter.sPath === sPath && !sorter.bDescending;
                });

                if (bDescending) {
                    oBinding.sort(new sap.ui.model.Sorter(sPath, true));
                } else {
                    oBinding.sort(new sap.ui.model.Sorter(sPath, false));
                }
            },

            onSelectionChange: function (oEvent) {
                var oFilterBar = this.byId("filterBar");
                oFilterBar.fireFilterChange(oEvent);
            },





            onApplyFilters: function () {
                debugger;
                var oTable = this.byId("Tableid");
                var oBinding = oTable.getBinding("rows");
                var aFilters = [];

                // Start Date and End Date range filter
                var sStartDate = this.getView().byId("startDateInput").getValue();
                var sEndDate = this.getView().byId("endDateInput").getValue();
                if (sStartDate && sEndDate) {
                    if (sStartDate > sEndDate) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Start date cannot be greater than end date.");
                        // Reset the input values or take necessary action
                        // this.getView().byId("startDateInput").setValue("");
                        this.getView().byId("endDateInput").setValue("");
                        return;
                    }
                    var oDateFilter = new sap.ui.model.Filter("CHECKIN_DATE", sap.ui.model.FilterOperator.BT, sStartDate, sEndDate);
                    aFilters.push(oDateFilter);
                }

                // GP Number range filter
                var sInitialGP = this.getView().byId("initialGP").getValue();
                var sFinalGP = this.getView().byId("finalGP").getValue();

                if (sInitialGP && sFinalGP) {
                    sInitialGP = this.getView().byId("initialGP").getValue().toString().padStart(10, '0');;
                    sFinalGP = this.getView().byId("finalGP").getValue().toString().padStart(10, '0');

                    if (sInitialGP > sFinalGP) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset the input values or take necessary action
                        this.getView().byId("finalGP").setValue("");
                        return;
                    }
                    var oGPFilter = new sap.ui.model.Filter("GP_NO", sap.ui.model.FilterOperator.BT, sInitialGP, sFinalGP);
                    aFilters.push(oGPFilter);
                }

                // PO Number range filter
                var sInitialPO = this.getView().byId("initialPO").getValue();
                var sFinalPO = this.getView().byId("finalPO").getValue();
                if (sInitialPO && sFinalPO) {
                    sInitialPO = this.getView().byId("initialPO").getValue().toString().padStart(10, '0');
                    sFinalPO = this.getView().byId("finalPO").getValue().toString().padStart(10, '0');
                    if (sInitialPO > sFinalPO) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset the input values or take necessary action
                        this.getView().byId("finalPO").setValue("");
                        return;
                    }
                    var oPOFilter = new sap.ui.model.Filter("REF_DOC", sap.ui.model.FilterOperator.BT, sInitialPO, sFinalPO);
                    aFilters.push(oPOFilter);
                }

                // SHIP Number range filter
                var sInitialSHIP = this.getView().byId("initialSHIP").getValue();
                var sFinalSHIP = this.getView().byId("finalSHIP").getValue();
                if (sInitialSHIP && sFinalSHIP) {
                    sInitialSHIP = this.getView().byId("initialSHIP").getValue().toString().padStart(10, '0');
                    sFinalSHIP = this.getView().byId("finalSHIP").getValue().toString().padStart(10, '0');
                    if (sInitialSHIP > sFinalSHIP) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset the input values or take necessary action
                        this.getView().byId("finalSHIP").setValue("");
                        return;
                    }
                    var oSHIPFilter = new sap.ui.model.Filter("REF_DOC", sap.ui.model.FilterOperator.BT, sInitialSHIP, sFinalSHIP);
                    aFilters.push(oSHIPFilter);
                }

                // Material Number range filter
                var sInitialMN = this.getView().byId("initialMN").getValue();
                var sFinalMN = this.getView().byId("finalMN").getValue();
                // Handle Material Number range filter if needed...

                // Vehicle Number filter
                var sInitialVN = this.getView().byId("initialVN").getValue();
                if (sInitialVN) {
                    var oVNFilter = new sap.ui.model.Filter("VEHICLE_NO", sap.ui.model.FilterOperator.Contains, sInitialVN);
                    aFilters.push(oVNFilter);
                }

                // Apply all filters together
                if (aFilters.length > 0) {
                    var oCombinedFilter = new sap.ui.model.Filter(aFilters, true); // true for AND operation
                    oBinding.filter(oCombinedFilter);
                } else {
                    oBinding.filter([]); // Clear filter if no filter conditions are met
                }
            },








            onStartDateChange: function () {
                this.onApplyFilters();
            },

            onEndDateChange: function () {

                this.onApplyFilters();
            },


            oninitialGPChange: function () {

                this.onApplyFilters();
            },

            onfinalGPChange: function () {

                this.onApplyFilters();
            },



            oninitialPOChange: function () {

                this.onApplyFilters();
            },

            onfinalPOChange: function () {

                this.onApplyFilters();
            },

            oninitialSHIPChange: function () {

                this.onApplyFilters();
            },

            onfinalSHIPChange: function () {

                this.onApplyFilters();
            },

            oninitialMNChange: function () {


                this.onApplyFilters();
            },

            onfinalMNChange: function () {

                this.onApplyFilters();
            },

            oninitialVNChange: function () {

                this.onApplyFilters();


            },




            onBackPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Home");
            },
        })
    });