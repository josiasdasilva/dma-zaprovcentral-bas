sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "dma/zaprovcentral/controller/BaseController",
    "sap/ui/core/routing/History",
    "dma/zaprovcentral/controller/formatter"
], function (BaseController, History, Formatter) {
	"use strict";

	return BaseController.extend("dma.zaprovcentral.controller.detailPage", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf teste.Teste21.view.detailPage
		 */
		onInit: function () {
			
		},


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf teste.Teste21.view.detailPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},


		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf teste.Teste21.view.detailPage
		 */
		//	onAfterRendering: function() {
		//
		//	},


		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf teste.Teste21.view.detailPage
		 */
		//	onExit: function() {
		//
        //	}
        

        formatter: Formatter,

        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado 
         */
        onLineSelection: function(oEvt){
            const oModel = this.getView().getModel("modelMockData1"),
                  oItemsSelected = oEvt.getSource().getSelectedItems();
            let sSelectedItems = "";

            for(let sIndex in oItemsSelected){
                sSelectedItems += oModel.getProperty(oItemsSelected[sIndex].getBindingContextPath()).NumItem + " / ";
            }

            if(sSelectedItems && sSelectedItems.length >= 3){
                sSelectedItems = sSelectedItems.slice(0, sSelectedItems.length - 3);
                sap.m.MessageToast.show(sSelectedItems);
            }
        },
        
        
        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
		onBack: function(oEvt){
            this.onBackGlobal(oEvt, "routeMainPage");
		},
	});

});