sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "gatepass/gatepass/utils/datamanager_vp",
    "gatepass/gatepass/utils/formatter",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Filter, FilterOperator, datamanager, formatter, MessageToast, ValueState, Fragment) {
        "use strict";

        return Controller.extend("gatepass.gatepass.controller.Visitor", {

            formate: formatter,

            searchResponse: {
                data: []
            },



            f4Help: {
                arrF4Data: [],
                custData: [],
                suppData: [],
                matData: []
            },

            objImg: {
                VISITOR_IMG: ""
            },


            objPostData: {
                VISITOR_NO: "",
                VISITOR_NAME: "",
                VISITOR_CNIC: "",
                VISITOR_CONTACT: "",
                HOST_NAME: "",
                VISIT_LOCATION: "",
                PURPOSE_OF_VISIT: "",
                VISITOR_CATEGORY: "",
                VEHICLE_DESCRIPTION: "",
                VEHICLE_NO: "",
                VISITOR_COMPANY: "",
                VISIT_DATE: "",
                EXPECTED_DURATION: "",
                CHECKIN_DATE: "",
                CHECKIN_TIME: "",
                CHECKOUT_DATE: "",
                CHECKOUT_TIME: "",
                REMARKS: "",
                DATEIN: "",
                TIMEIN: "",
                DATEOUT: "",
                TIMEOUT: "",
                REASON_MT: "",
                VISITOR_IMG: ""
            },

            onInit: function () {

                let that = this;

                var sImagePath = sap.ui.require.toUrl("gatepass/gatepass/Images/TMCLogo_favicon.png");
                this.getView().byId("VisitImage").setSrc(sImagePath);

                //set model in view initially with object containing fields
                var oModelPost = new JSONModel(this.objPostData);
                var oModelImg = new JSONModel(this.objImg);
                this.getView().setModel(oModelPost, "gpData");
                this.getView().setModel(oModelImg, "ImageModel")


            },


            onBackPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Home");
            },

            _imageCaptureDialog: null,
            _videoStream: null,

            onOpenCamera: function () {
                debugger;
                if (!this._imageCaptureDialog) {
                    // Load the fragment if it's not already loaded
                    Fragment.load({
                        name: "gatepass.gatepass.fragments.ImageCapture",
                        controller: this
                    }).then(function (oDialog) {
                        debugger;
                        // Connect dialog to the root view of this component (models, lifecycle)
                        this.getView().addDependent(oDialog);
                        this._imageCaptureDialog = oDialog;
                        oDialog.open();
                        this.startCamera();
                    }.bind(this)).catch(function (oError) {
                        console.error("Error loading fragment:", oError);
                    });
                } else {
                    // If the dialog is already loaded, just open it
                    this._imageCaptureDialog.open();

                    // Stop the existing camera stream if it's active
                    if (this._videoStream) {
                        this._videoStream.getTracks().forEach(track => track.stop());
                        this._videoStream = null;
                    }

                    // Start accessing the camera again
                    this.startCamera();
                }

            },




            startCamera: function () {
                var that = this;
                debugger;

                if (that._imageCaptureDialog) {
                    debugger;
                    var content = that._imageCaptureDialog.getContent()[0];
                    var video = content.mAggregations.items[0];
                    if (!that._videoStream && video) {
                        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(function (stream) {
                                debugger;
                                if (video) {
                                    video.getDomRef().srcObject = stream;
                                    that._videoStream = stream;
                                } else {
                                    console.error("Video element not found or not accessible.");
                                }
                            })
                            .catch(function (error) {
                                console.error("Error accessing camera:", error);
                            });
                    } else {
                        console.error("Video element not found or camera stream already started.");
                    }
                } else {
                    console.error("Popup is not loaded.");
                }
            },



            onClose: function () {


                // Stop the camera stream if it's active
                if (this._videoStream) {
                    this._videoStream.getTracks().forEach(track => track.stop());
                    this._videoStream = null;
                }

                // Close the popup dialog
                if (this._imageCaptureDialog) {
                    this._imageCaptureDialog.close();
                }
            },


            Img: '',
            capturePicture: function () {
                // Get the fragment reference
                var oFragment = this._imageCaptureDialog;

                if (oFragment) {
                    // Get the video element from the fragment
                    var content = this._imageCaptureDialog.getContent()[0];
                    var video = content.mAggregations.items[0];

                    // Check if video is loaded and displaying the camera feed
                    if (!video || !video.getDomRef().videoWidth || !video.getDomRef().videoHeight) {
                        console.error("Video element not loaded or camera feed not available.");
                        return;
                    }

                    try {
                        // Create a canvas element to draw the image
                        var canvas = document.createElement("canvas");
                        canvas.width = video.getDomRef().videoWidth;
                        canvas.height = video.getDomRef().videoHeight;
                        var context = canvas.getContext("2d");

                        // Draw the video frame on the canvas
                        context.drawImage(video.getDomRef(), 0, 0, canvas.width, canvas.height);

                        // Convert the canvas content to base64 data URL with compression
                        canvas.toBlob(function (blob) {
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var compressedImageDataUrl = reader.result;
                                this.Img = compressedImageDataUrl;

                                // Do something with the compressed image data URL
                                console.log("Compressed image:", compressedImageDataUrl);
                                MessageToast.show("Picture Captured");
                                this.getView().getModel("ImageModel").setProperty("/VISITOR_IMG", this.Img);

                                // Close the popup dialog
                                this.onClose();
                            }.bind(this);
                            reader.readAsDataURL(blob);
                        }.bind(this), 'image/jpeg', 0.8); // Adjust quality as needed
                    } catch (error) {
                        console.error("Error capturing picture:", error);
                    }
                } else {
                    console.error("Image capture dialog not loaded.");
                }
            },



            hide: false,
            manualTracking: function () {
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
                this.getView().byId("visitpassNum").setValue("");
                this.getView().byId("VISITOR_NAME").setValue("");
                this.getView().byId("VISITOR_CNIC").setValue("");
                this.getView().byId("VISITOR_CONTACT").setValue("");
                this.getView().byId("HOST_NAME").setValue("");
                this.getView().byId("VISIT_LOC").setValue("");
                this.getView().byId("POV").setValue("");
                this.getView().byId("VISITOR_CAT").setValue("");
                this.getView().byId("VEHICLE_DES").setValue("");
                this.getView().byId("VEHICLE_NO").setValue("");
                this.getView().byId("VISITOR_COMPANY").setValue("");
                this.getView().byId("VISIT_DATE").setValue("");
                this.getView().byId("EXP_DURATION").setValue("");
                this.getView().byId("checkInDate").setValue("");
                this.getView().byId("checkInTime").setValue("");
                this.getView().byId("checkOutDate").setValue("");
                this.getView().byId("checkOutTime").setValue("");
                this.getView().byId("REMARKS").setValue("");
                this.getView().byId("DATEIN").setValue("");
                this.getView().byId("DATEOUT").setValue("");
                this.getView().byId("TIMEIN").setValue("");
                this.getView().byId("TIMEOUT").setValue("");
                this.getView().byId("save").setEnabled(false);
                this.getView().byId("delete").setEnabled(false);
                this.getView().byId("camera").setVisible(true);
                this.getView().byId("img").setSrc('../Images/Visitor.png');
                this.getView().byId("btnChkOut").setVisible(false);
                var form = this.getView().byId("FormChangeColumn_oneGroup235");
                var btnMT = this.getView().byId("manualTracking");
                this.getView().byId("createVP").setEnabled(true);

                form.setVisible(false);
                btnMT.setEnabled(true);
                btnMT.setText("Manual Tracking");
                btnMT.setType("Default");

                var I = this.getView().getModel('ImageModel')
                if (I) {
                    var modelData = I.getData(); // Get the current data of the model
                    modelData.VISITOR_IMG = null; // Set the property value to null
                    I.setData(modelData);;
                }

                var oModel = this.getView().getModel('gpData'); // Get the model bound to your view

                oModel.setProperty("/CHECKIN_DATE", "");
                oModel.setProperty("/CHECKIN_TIME", "");
                oModel.refresh();

            },
            onCreate: function () {
                this.onAction();
                this.counted = 0;
                this.editable = false;
            },

            zdialog: "",

            _ParentValueHelpSearch: function (oEvent) {

                debugger;
                // let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                var searchQuery = oEvent.getParameter("value");
                if (oEvent.mParameters.id === 'vp') {
                    var data = 'VISITOR_NO';
                    var zdialog = this.newGateDialog1;
                }

                this.zdialog = zdialog;

                if (!searchQuery) {

                    this.clearFilters();
                } else {
                    var filters = [];
                    if (!isNaN(searchQuery)) {
                        filters.push(new Filter(data, FilterOperator.EQ, parseInt(searchQuery)));
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

            },



            data: function () {
                let that = this;
                datamanager.getF4HelpData(function (response) {

                    //set response data in global object
                    debugger;
                    that.searchResponse.data = response.results;

                }, function (error) {
                    console.log(error);
                });

            },
            visitPassFragment: function () {
                debugger;

                let that = this;
                // this.data();
                let object = {
                    // key: selectedKey,
                    Key: 'VP'
                }

                if (object.Key) {

                    datamanager.getF4HelpData(object, function (response) {

                        //set response data in global object
                        debugger;
                        that.searchResponse.data = response.Value;



                        if (that.searchResponse.data.length > 0) {
                            // that.searchResponse.data.forEach(function (obj) {

                            //     if (obj.Key === 'VP') {
                            that.f4Help.matData = JSON.parse(response.Value);
                            console.log(that.f4Help.matData);
                            // }

                            // });
                        }

                        // if(that.newGateDialog1){
                        //     that.newGateDialog1.destroy();
                        //     that.newGateDialog1 = null;
                        //     }


                        if (!that.newGateDialog1) {
                            that.newGateDialog1 = sap.ui.xmlfragment("gatepass.gatepass.fragments.Visitor", that);
                            var oModel = new sap.ui.model.json.JSONModel(that.f4Help);
                            that.newGateDialog1.setModel(oModel);

                        }

                        that.newGateDialog1.getModel().refresh(true);
                        that.newGateDialog1.open();
                    }, function (error) {
                        console.log(error);
                    });
                }
            },

            selectParentItem: function (evt) {
                //debugger;

                var oSelectedItem = evt.mParameters.selectedItems;

                if (oSelectedItem) {

                    var productInput1 = this.byId("visitpassNum");

                    var oPrnr1 = oSelectedItem[0].getTitle();

                    var oName1 = oSelectedItem[0].getDescription();

                    productInput1.setValue(oPrnr1);

                    productInput1.setValue(oName1);

                }

                evt.getSource().getBinding("items").filter([]);

            },




            getVPDetails: function () {
                debugger;

                let that = this;
                // let selectedKey = this.getView().byId("referencesType").getSelectedKey();
                let docValue = this.getView().byId('visitpassNum').getValue();
                if (!docValue) {
                    MessageToast.show("Please Enter VisitorPass No!");
                }

                let oObject = {
                    // key: selectedKey,
                    Number: docValue
                }

                if (oObject.Number) {
                    debugger;
                    datamanager.getVPDetails(oObject, function (response) {
                        debugger;
                        that.objPostData = JSON.parse(response.EvJson);
                        var oModelGPDetails = new sap.ui.model.json.JSONModel(that.objPostData);

                        var oData = oModelGPDetails.getData();

                        Object.keys(oData).forEach(function (property) {
                            // Apply formatter only to properties that require formatting
                            if (property === "VISITOR_IMG") {
                                return;
                            }

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


                        debugger;
                        var oModel = that.getView().getModel("GPDetailsModel");


                        if (oModel) {
                            // Clear the model
                            // oModel.setData(that.objPostData);
                            oModel.setData(oData);
                        } else {
                            oModelGPDetails.setData(oData);
                            that.getView().setModel(oModelGPDetails, "GPDetailsModel");
                            var oModel = that.getView().getModel("GPDetailsModel");
                        }
                        // that.handleImageDisplay();



                        var sVisitorNo = oModel.getProperty("/VISITOR_NO");
                        var sVisitorName = oModel.getProperty("/VISITOR_NAME");
                        var sVisitorCnic = oModel.getProperty("/VISITOR_CNIC");
                        var sVisitorContact = oModel.getProperty("/VISITOR_CONTACT");
                        var sHostName = oModel.getProperty("/HOST_NAME");
                        var sVisitLocation = oModel.getProperty("/VISIT_LOCATION");
                        var sPurposeOfVisit = oModel.getProperty("/PURPOSE_OF_VISIT");
                        var sVisitorCategory = oModel.getProperty("/VISITOR_CATEGORY");
                        var sVehicleDescription = oModel.getProperty("/VEHICLE_DESCRIPTION");
                        var sVehicleNo = oModel.getProperty("/VEHICLE_NO");
                        var sVisitorCompany = oModel.getProperty("/VISITOR_COMPANY");
                        var sVisitDate = oModel.getProperty("/VISIT_DATE");
                        var sExpectedDuration = oModel.getProperty("/EXPECTED_DURATION");
                        var sCheckInDate = oModel.getProperty("/CHECKIN_DATE");
                        var sCheckInTime = oModel.getProperty("/CHECKIN_TIME");
                        var sCheckOutDate = oModel.getProperty("/CHECKOUT_DATE");
                        var sCheckOutTime = oModel.getProperty("/CHECKOUT_TIME");
                        var sRemarks = oModel.getProperty("/REMARKS");
                        var sDateIn = oModel.getProperty("/DATEIN");
                        var sTimeIn = oModel.getProperty("/TIMEIN");
                        var sDateOut = oModel.getProperty("/DATEOUT");
                        var sTimeOut = oModel.getProperty("/TIMEOUT");
                        var sReasonMt = oModel.getProperty("/REASON_MT");
                        var sVisitorimg = oModel.getProperty("/VISITOR_IMG");

                        that.getView().byId("camera").setVisible(false);

                        var ModelImg = that.getView().getModel("ImageModel");
                        ModelImg.setProperty("/VISITOR_IMG", sVisitorimg);

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


                        that.getView().byId("visitpassNum").setValue(sVisitorNo);
                        that.getView().byId("VISITOR_NAME").setValue(sVisitorName);
                        that.getView().byId("VISITOR_CNIC").setValue(sVisitorCnic);
                        that.getView().byId("VISITOR_CONTACT").setValue(sVisitorContact);
                        that.getView().byId("HOST_NAME").setValue(sHostName);
                        that.getView().byId("VISIT_LOC").setValue(sVisitLocation);
                        that.getView().byId("POV").setValue(sPurposeOfVisit);
                        that.getView().byId("VISITOR_CAT").setValue(sVisitorCategory);
                        that.getView().byId("VEHICLE_DES").setValue(sVehicleDescription);
                        that.getView().byId("VEHICLE_NO").setValue(sVehicleNo);
                        that.getView().byId("VISITOR_COMPANY").setValue(sVisitorCompany);
                        that.getView().byId("VISIT_DATE").setValue(sVisitDate);
                        that.getView().byId("EXP_DURATION").setValue(sExpectedDuration);
                        that.getView().byId("checkInDate").setValue(sCheckInDate);
                        that.getView().byId("checkInTime").setValue(sCheckInTime);
                        that.getView().byId("checkOutDate").setValue(sCheckOutDate);
                        that.getView().byId("checkOutTime").setValue(sCheckOutTime);
                        that.getView().byId("REMARKS").setValue(sRemarks);
                        that.getView().byId("DATEIN").setValue(sDateIn);
                        that.getView().byId("TIMEIN").setValue(sTimeIn);
                        that.getView().byId("DATEOUT").setValue(sDateOut);
                        that.getView().byId("TIMEOUT").setValue(sTimeOut);
                        that.getView().byId("REASON_MT").setValue(sReasonMt);
                        // that.getView().byId("img").setSrc(sVisitorimg);
                        that.getView().byId("save").setEnabled(true);
                        that.getView().byId("delete").setEnabled(true);
                        that.getView().byId("createVP").setEnabled(false);

                    })

                }
            },

            handleImageDisplay: function () {
                debugger;
                var that = this;
                var sVisitorimg = that.getView().getModel("GPDetailsModel").getProperty("/VISITOR_IMG");


                // Create an image element
                var img = new Image();
                img.src = sVisitorimg;


                // When the image is loaded
                // img.onload = function () {
                debugger;
                // Create a canvas element
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // Resize the image
                canvas.width = 10; // Set desired width
                canvas.height = 10; // Set desired height
                ctx.drawImage(img, 0, 0, 10, 10); // Draw the resized image

                // Get the resized image data
                var resizedImageData = canvas.toDataURL('image/jpeg');

                // Set the resized image data as source for the UI5 Image control
                // that.getView().byId("img").setSrc(resizedImageData);
                // }


            },

            Validator: function () {

                var VisitorNameById = this.getView().byId("VISITOR_NAME");
                var VisitorName = VisitorNameById.getValue();
                if (VisitorName === '') {
                    VisitorNameById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Visitor Name!");
                    return false;
                } else {
                    VisitorNameById.setValueState(ValueState.None);
                }

                var VisitorCnicById = this.getView().byId("VISITOR_CNIC");
                var VisitorCnic = VisitorCnicById.getValue();
                if (VisitorCnic === '') {
                    VisitorCnicById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Visitor CNIC!");
                    return false;
                } else {
                    VisitorCnicById.setValueState(ValueState.None);
                }


                var VisitLocationById = this.getView().byId("VISIT_LOC");
                var VisitLocation = VisitLocationById.getValue();
                if (VisitLocation === '') {
                    VisitLocationById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Visit Location!");
                    return false;
                } else {
                    VisitLocationById.setValueState(ValueState.None);
                }

                var PurposeOfVisitById = this.getView().byId("POV");
                var PurposeOfVisit = PurposeOfVisitById.getValue();
                if (PurposeOfVisit === '') {
                    PurposeOfVisitById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Purpose of Visit!");
                    return false;
                } else {
                    PurposeOfVisitById.setValueState(ValueState.None);
                }
                var VehicleNoById = this.getView().byId("VEHICLE_NO");
                var VehicleNo = VehicleNoById.getValue();
                if (VehicleNo === '') {
                    VehicleNoById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Vehicle No!");
                    return false;
                } else {
                    VehicleNoById.setValueState(ValueState.None);
                }


                var VisitorCompanyById = this.getView().byId("VISITOR_COMPANY");
                var VisitorCompany = VisitorCompanyById.getValue();
                if (VisitorCompany === '') {
                    VisitorCompanyById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Visitor's Company!");
                    return false;
                } else {
                    VisitorCompanyById.setValueState(ValueState.None);
                }

                var VisitDateById = this.getView().byId("VISIT_DATE");
                var VisitDate = VisitDateById.getValue();
                if (VisitDate === '') {
                    VisitDateById.setValueState(ValueState.Error);
                    MessageToast.show("Please Enter Visit Date!");
                    return false;
                } else {
                    VisitDateById.setValueState(ValueState.None);
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



            onCreateVP: function () {
                debugger;

                let that = this;
                //let itemArray = [];

                //var gpCreationData = this.getView().getModel('gpData').oData;
                console.log(this.getView().getModel('gpData').getData());
                this.getView().getModel('gpData').refresh(true);
                var gpCreationData = this.getView().getModel('gpData').getData();
                console.log(gpCreationData);
                this.objPostData = gpCreationData;


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

                    if (this.hide === false) {
                        if (this.Img != '') {
                            this.objPostData.VISITOR_IMG = this.Img;

                            var v = this.getView().getModel('GPDetailsModel')
                            if (v) {
                                v.setData({ ITEMS: [] });
                            }


                            datamanager.createData(that.objPostData, function (success) {
                                console.log(success);
                                MessageToast.show("VisitorPass Created Succesfully!");
                            }, function (error) {
                                console.log(error);
                            });

                            this.onAction();
                        } else {
                            MessageToast.show("Please Capture Visitor Picture")
                        }

                    } else {
                        var V1 = this.ValidatorForMT();
                        if (V1 === true) {

                            if (this.Img != '') {
                                this.objPostData.VISITOR_IMG = this.Img;


                                var v = this.getView().getModel('GPDetailsModel')
                                if (v) {
                                    v.setData({ ITEMS: [] });
                                }


                                datamanager.createData(that.objPostData, function (success) {
                                    console.log(success);
                                    MessageToast.show("VisitorPass Created Succesfully!");
                                }, function (error) {
                                    console.log(error);
                                });

                                this.onAction();
                                this.Img = '';
                            } else {
                                MessageToast.show("Please Capture Visitor Picture")
                            }
                        }
                    }
                }

            },

            onDownloadVP: function () {
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


            updateData: function () {
                debugger;

                let that = this;
                this.getView().getModel('gpData').refresh(true);
                var visit = this.getView().getModel("ImageModel").getProperty("/VISITOR_IMG");


                var gpCreationData = this.getView().getModel('gpData').getData();
                this.objPostData = gpCreationData;
                // this.objpostData.VISITOR_IMG = '';
                this.objPostData.VISITOR_IMG = visit;



                var V = this.Validator();
                if (V === true) {


                    datamanager.updateData(that.objPostData, function (success) {
                        console.log(success);
                        MessageToast.show("Data Updated Succesfully!");
                    }, function (error) {
                        console.log(error);
                    });

                    this.onAction();
                    this.Img = '';

                    var v = this.getView().getModel('GPDetailsModel')
                    if (v) {
                        v.setData("");
                    }
                    var I = this.getView().getModel('ImageModel')
                    if (I) {
                        var modelData = I.getData(); // Get the current data of the model
                        modelData.VISITOR_IMG = null; // Set the property value to null
                        I.setData(modelData);;
                    }



                    var btnChkOut = this.getView().byId("btnChkOut");
                    btnChkOut.setVisible(false);






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

                let docValue = this.getView().byId('visitpassNum').getValue();
                // let oModel = this.getView().getModel("GPDetailsModel");

                if (docValue.trim() === '') {
                    MessageToast.show("Please select VisitPass No to Delete");
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
