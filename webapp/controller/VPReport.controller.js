sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "gatepass/gatepass/utils/datamanager_vp"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, datamanager) {
        "use strict";

        return Controller.extend("gatepass.gatepass.controller.VPReport", {

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

            onInit: function () {

                // sap.ui.getCore().applyTheme('sap_belize_plus');

                var that = this;

                var sImagePath = sap.ui.require.toUrl("gatepass/gatepass/Images/TMCLogo_favicon.png");
                this.getView().byId("VPImage").setSrc(sImagePath);

                datamanager.getVPReport(function (response) {
                    debugger;
                    that.objGetData.Table = JSON.parse(response.EvJson);
                    var oModelVP = new sap.ui.model.json.JSONModel(that.objGetData);
                    that.getView().setModel(oModelVP, "oModelVP");
                })

                // var oTable = this.byId("Tableid");
                // oTable.setRowMode('Interactive');

            },


            zdialog: "",

            _ParentValueHelpSearch: function (oEvent) {

                debugger;
                var searchQuery = oEvent.getParameter("value");
                if (oEvent.mParameters.id.includes('VP')) {
                    var data = 'VISITOR_NO';
                    var zdialog = this.newRefdocDialog4;
                } else if (oEvent.mParameters.id.includes('VN')) {
                    var data1 = 'VEHICLE_NO';
                    var zdialog = this.newRefdocDialog1;
                } 

                this.zdialog = zdialog;

                if (!searchQuery) {

                    this.clearFilters();
                } else {
                    var filters = [];
                    if (!isNaN(searchQuery)) {
                        filters.push(new Filter(data, FilterOperator.EQ, parseInt(searchQuery)));
                    }else{
                        filters.push(new Filter(data1, FilterOperator.Contains,searchQuery));

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




           
            refDocFragment: function (evt) {
                debugger;
                let that = this;
                var field = evt.mParameters.id;
                // this.evnt =evt;
                // var object = {};
                // if (field.includes('VN')) {

                   var object = {
                        // key: selectedKey,
                        Key: 'VP'
                    }
                // } else if (field.includes('VP')) {

                //     object = {
                //         // key: selectedKey,
                //         Key: 'VP'
                //     }
                // }

                if (object.Key) {

                    datamanager.getF4HelpData(object, function (response) {

                        //set response data in global object
                        debugger;
                        that.searchResponse.data = response.Value;

                        if (that.searchResponse.data.length > 0) {
                            

                                debugger;

                                if (field.includes("initialVN")) {
                                    that.f4Help.ITEMS = JSON.parse(response.Value);
                                    console.log(that.f4Help.ITEMS);


                                    if(that.newRefdocDialog1){
                                        that.newRefdocDialog1.destroy();
                                        that.newRefdocDialog1 = null;
                                        }

                                    

                                    if (!that.newRefdocDialog1) {

                                        that.newRefdocDialog1 = sap.ui.xmlfragment(field, "gatepass.gatepass.fragments.Referencedoc", that);
                                        // console.log(this.newRefdocDialog1);
                                        var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                                        //oModel.setData(arrF4Data);
                                        that.newRefdocDialog1.setModel(oModel, 'oModel');
                                        // var oModel1 = this.newRefdocDialog1.getModel('oModel');

                                        that.getView().addDependent(that.newRefdocDialog1); //addDependent to access the model in fragment
                                        that.newRefdocDialog1.bindAggregation("items", {
                                            path: "oModel>/ITEMS",
                                            template: new sap.m.StandardListItem({
                                                title: "Vehicle Number",
                                                description: "{oModel>VEHICLE_NO}"
                                            })

                                        });


                                    } else {
                                        that.newRefdocDialog1.sId = field;
                                    }
                                    that.newRefdocDialog1.getModel().refresh(true);
                                    that.newRefdocDialog1.attachConfirm(that.onConfirm, that);
                                    that.newRefdocDialog1.open();

                                } if (field.includes("initialVP") || field.includes("finalVP")) {
                                    debugger;
                                    that.f4Help.ITEMS = JSON.parse(response.Value);
                                    console.log(that.f4Help.ITEMS);

                                    if(that.newRefdocDialog4){
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
                                                title: "VisitorPass Number",
                                                description: "{oModel>VISITOR_NO}"
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

                    });
                }
            },




            // this.newRefdocDialog1.open();




            selectRefDoc: function (evt) {
                debugger;

                var oSelectedItem = evt.mParameters.selectedItems;
                var selected = evt.mParameters.id;

                if (oSelectedItem && selected.includes("initialVP")) {

                    var productInput1 = this.byId("initialVP");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);
                    this.oninitialVPChange();

                } else if (oSelectedItem && selected.includes("finalVP")) {
                    var productInput1 = this.byId("finalVP");

                    // var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    // productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);
                    this.onfinalVPChange();
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
                debugger;
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



                // Check if the query is a valid number
                if (!isNaN(sQuery)) {
                    // Treat it as a number
                    var aFields = [
                        "VISITOR_NO", "VISITOR_CNIC", "VISITOR_CONTACT", "VEHICLE_NO"
                    ];

                    // Iterate over the fields and push filters into the aFilters array
                    aFields.forEach(function (fieldName) {
                        debugger;
                        aFilters.push(new Filter(fieldName, FilterOperator.EQ, parseInt(sQuery))); // Assuming sQuery is defined
                    });
                } else {
                    // Treat it as a string
                    var aFilterFields = [
                        "VISITOR_NAME", "HOST_NAME", "VISIT_LOCATION",
                        "PURPOSE_OF_VISIT", "VISITOR_CATEGORY", "VEHICLE_DESCRIPTION", "VISITOR_COMPANY",
                        "EXPECTED_DURATION", "REMARKS", "REASON_MT",

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
                var oFilterBar = this.byId("filterBar");
                var bFilterBarVisible = oFilterBar.getVisible();
                // var bDropdownVisible = oFilterBar.getFilterGroupItems().length > 0;

                oFilterBar.setVisible(!bFilterBarVisible);
                // oClearFilterButton.setVisible(!bFilterBarVisible);

                // // Toggle dropdown list visibility only if there are filter group items
                // if (bDropdownVisible) {
                //     var oDropdown = oFilterBar._oBasicSearchField.getPicker();
                //     if (oDropdown) {
                //         oDropdown.toggle();
                //     }
                // }
            },

            onFilterChange: function () {
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

            onClearFilters: function () {
                debugger;
                var oTable = this.byId("Tableid");
                var oBinding = oTable.getBinding("rows");


                oBinding.filter([]);
                this.getView().byId("startDateInput").setValue("");
                this.getView().byId("endDateInput").setValue("");
                this.getView().byId("initialVP").setValue("");
                this.getView().byId("finalVP").setValue("");
                this.getView().byId("initialVN").setValue("");


            },

            onSortIconPress: function () {
                debugger;
                var oTable = this.getView().byId("Tableid");
                var oBinding = oTable.getBinding("rows");
                var sPath = "VISITOR_NO"; // Property name for sorting
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

            onStartDateChange: function (oEvent) {
                var sStartDate = oEvent.getParameter("value");
                var sEndDate = this.getView().byId("endDateInput").getValue();

                this.applyDateRangeFilter(sStartDate, sEndDate);
            },

            onEndDateChange: function (oEvent) {
                var sEndDate = oEvent.getParameter("value");
                var sStartDate = this.getView().byId("startDateInput").getValue();

                this.applyDateRangeFilter(sStartDate, sEndDate);
            },

            applyDateRangeFilter: function (sStartDate, sEndDate) {
                var oTable = this.byId("Tableid");
                var oBinding = oTable.getBinding("rows");

                if (!sStartDate || !sEndDate) {
                    // Clear the filter if either start date or end date is not provided
                    oBinding.filter([]);
                    return;
                }

                // var oStartDate = new Date(sStartDate);
                // var oEndDate = new Date(sEndDate);

                // Filter the table data based on the range of IDs falling within the date range
                var oFilter = new Filter({
                    filters: [
                        new Filter("CHECKIN_DATE", FilterOperator.GE, sStartDate),
                        new Filter("CHECKIN_DATE", FilterOperator.LE, sEndDate)
                    ],
                    and: true
                });

                oBinding.filter(oFilter);
            },


            onStartDateChange: function () {
                this.onApplyFilters();
            },

            onEndDateChange: function () {

                this.onApplyFilters();
            },


            oninitialVPChange: function () {

                this.onApplyFilters();
            },

            onfinalVPChange: function () {

                this.onApplyFilters();
            },

            oninitialVNChange: function () {

                this.onApplyFilters();


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

                // VP Number range filter
                var sInitialVP = this.getView().byId("initialVP").getValue();
                var sFinalVP = this.getView().byId("finalVP").getValue();
                if (sInitialVP && sFinalVP) {
                    sInitialVP = this.getView().byId("initialVP").getValue().toString().padStart(10, '0');
                    sFinalVP = this.getView().byId("finalVP").getValue().toString().padStart(10, '0');
                    if (sInitialVP > sFinalVP) {
                        // Show error message or handle validation failure
                        sap.m.MessageToast.show("Final value must be greater than the initial value.");
                        // Reset the input values or take necessary action
                        this.getView().byId("finalVP").setValue("");
                        return;
                    }
                    var oGPFilter = new sap.ui.model.Filter("VISITOR_NO", sap.ui.model.FilterOperator.BT, sInitialVP, sFinalVP);
                    aFilters.push(oGPFilter);
                }



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




            onBackPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Home");
            },
        });
    });