sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";

	var _modelBase = null;

	function _getOData(sPath, oContext, oUrlParams, successCallback, errorCallback) {
		_modelBase.read(sPath, oContext, oUrlParams, true, function (response) {

			successCallback(response);
		}, function (response) {

			errorCallback(response);
		});
	}

	function _postData(sPath, oContext, sucessCallback, errorCallback) {
		_modelBase.create(sPath, oContext, null, sucessCallback, errorCallback);
	}

	function _deleteData(sPath, successCallback, errorCallback) {
		_modelBase.remove(sPath, {
			success: function(data) {
				successCallback(data);
			},
			error: function(error) {
				errorCallback(error);
			}
		});
	}


	return {

		init: function (oDataModel) {
			_modelBase = oDataModel;
			_modelBase.setCountSupported(false);
		},

		getoDataModel: function () {
			return _modelBase;
		},

		oModelRefresh: function () {
			_modelBase.refresh(true, false);
		},

		getTasksListData: function (successCallback, errorCallback) {
			
			//var sPath = "es_search_data";

			_getOData(sPath, null, null, function (objResponse) {
				var oResult = objResponse;

				successCallback(oResult);
			}, function (objResponse) {
				//console.log("Error");
				errorCallback(objResponse);
			});

		},

		getF4HelpData: function (object,successCallback, errorCallback) {

			var itemData = {
				IvCall: '',
				IvKey:  object.Key,
                IvNumber: ''
            };

			var sPath = "et_search_dataSet(IvCall='" + itemData.IvCall + "',IvKey='" + itemData.IvKey + "',IvNumber='" + itemData.IvNumber + "')";

			_getOData(sPath, null, null, function (objResponse) {
				var oResult = objResponse;

				successCallback(oResult);
			}, function (objResponse) {
				//console.log("Error");
				errorCallback(objResponse);
			});

		},

		getItemList: function(object, successCallback, errorCallback){

			debugger;
			var itemData = {
				IvCall: 'I',
				IvKey: object.key,
                IvNumber: object.Number
            };
			var sPath = "et_item_dataSet(IvCall='I',IvKey='" + itemData.IvKey + "',IvNumber='" + itemData.IvNumber + "')";
			
			_getOData(sPath, null, null, function (objResponse) {
				var oResult = objResponse;

				successCallback(oResult);
			}, function (objResponse) {
				//console.log("Error");
				errorCallback(objResponse);
			});


		},

		getGPDetails: function(object, successCallback, errorCallback){

			debugger;
			var itemData = {
				IvCall: 'G',
				IvKey:  '',
                IvNumber: object.Number
            };
			var sPath = "et_item_dataSet(IvCall='G',IvKey='" + itemData.IvKey + "',IvNumber='" + itemData.IvNumber + "')";
			
			_getOData(sPath, null, null, function (objResponse) {
				var oResult = objResponse;

				successCallback(oResult);
			}, function (objResponse) {
				//console.log("Error");
				errorCallback(objResponse);
			});


		},


		createData: function(oObject,successCallback, errorCallback){
			debugger;
			var dataToPost1 = {
				IvCall: 'S',
                IvJson: JSON.stringify(oObject)
            };
 
            //var sPath = "/sap/opu/odata/sap/ZCDS_ODATA_SRV/CreateSet";
			var sPath = "et_gatepass_createSet";

            _postData(sPath, dataToPost1,
                function (objResponse) {
                    var oResult = objResponse;
                    successCallback(oResult);

                },
                function (objResponse) {
                    errorCallback(objResponse);
                });
		},

		adobeForm: function(successCallback, errorCallback){
			debugger;
			var itemData = {
				IvCall: 'P',
				IvKey:  '',
                IvNumber: ''
            };
			var sPath = "et_item_dataSet(IvCall='P',IvKey='" + itemData.IvKey + "',IvNumber='" + itemData.IvNumber + "')";
			
			_getOData(sPath, null, null, function (objResponse) {
				var oResult = objResponse;

				successCallback(oResult);
			}, function (objResponse) {
				//console.log("Error");
				errorCallback(objResponse);
			});
		},

		updateData: function(oObject,successCallback, errorCallback){
			debugger;
			var dataToPost1 = {
				IvCall: 'U',
                IvJson: JSON.stringify(oObject)
            };
 
            //var sPath = "/sap/opu/odata/sap/ZCDS_ODATA_SRV/CreateSet";
			var sPath = "et_gatepass_createSet";

            _postData(sPath, dataToPost1,
                function (objResponse) {
                    var oResult = objResponse;
                    successCallback(oResult);

                },
                function (objResponse) {
                    errorCallback(objResponse);
                });
		},

		deleteData: function(oObject,successCallback, errorCallback){

			

			debugger;
			var dataToPost1 = {
				IvCall: 'D',
				IvKey : '',
                IvNumber: oObject.Number
            };
 
            //var sPath = "/sap/opu/odata/sap/ZCDS_ODATA_SRV/CreateSet";
			var sPath = "et_gatepass_createSet(IvCall='D',IvKey='',IvNumber='" + dataToPost1.IvNumber + "')";

            _deleteData(sPath,
				function(objResponse) {
					var oResult = objResponse;
					successCallback(oResult);
				},
				function(objResponse) {
					errorCallback(objResponse);
				});
		},

		getGPReport: function(successCallback, errorCallback){

			debugger;
			var itemData = {
				IvCall: 'R',
				IvKey:  '',
                IvNumber: ''
            };
			var sPath = "et_item_dataSet(IvCall='R',IvKey='" + itemData.IvKey + "',IvNumber='" + itemData.IvNumber + "')";
			
			_getOData(sPath, null, null, function (objResponse) {
				var oResult = objResponse;

				successCallback(oResult);
			}, function (objResponse) {
				//console.log("Error");
				errorCallback(objResponse);
			});


		},
	};
});