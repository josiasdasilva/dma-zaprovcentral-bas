/*global history */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/Token"
], function (Controller, History, Token) {
	"use strict";

    return Controller.extend("dma.zfichatec.controller.BaseController",{
        
        
        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
		onBackGlobal: function(oEvt, sRouteName){
			const sPreviousHash = History.getInstance().getPreviousHash();
			
			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// There is no history!
				// replace the current hash with page 1 (will not add an history entry)
				this.getOwnerComponent().getRouter().navTo(sRouteName, null, true);
			}
		},
    });
});