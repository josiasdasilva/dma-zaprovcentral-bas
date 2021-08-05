sap.ui.define([
    // "sap/ui/core/mvc/Controller"
    "dma/zaprovcentral/controller/BaseController",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController) {
		"use strict";

		return BaseController.extend("dma.zaprovcentral.controller.mainPage", {
            /**
             * 
             */
            onInit: function(){

            },
            

            /**
             * 
             * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
             */
            onValueHelpRequest: function(oEvt){
/*
                let a1 = sap.ui.getCore().byId(oEvt.getParameters().id); // Actual input field
                let a2 = a1.getParent().getAggregation("content")[0];
                a2.sId.search("idInputComprador01");
*/
                const oField        = sap.ui.getCore().byId(oEvt.getParameter("id")),
                      oModelFilters = this.getView().getModel("modelTableDefinition"),
                      oFields       = oModelFilters.getData().idTable01.fields;
                
                for(let iIndex in oFields){
                    if(typeof oFields[iIndex].filter !== "undefined"){
                        if(oField.getId().search(oFields[iIndex].filter.inputid) >= 0){
                            this[oFields[iIndex].filter.inputvaluehelpmethod](oEvt);
                        }
                    }
                }
            },


            /**
             * 
             * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
             */
            onValueHelpRequestComprador: function(oEvt){
                // debugger;
                const oField = sap.ui.getCore().byId(oEvt.getParameter("id"));
                sap.m.MessageToast.show("Comprador Value Help pressed");
            },


            /**
             * 
             * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
             */
            onValueHelpRequestFornecedor: function(oEvt){
                // debugger;
                sap.m.MessageToast.show("Fornecedor Value Help pressed");
            },


            /**
             * 
             * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
             */
            onValueHelpRequestCd: function(oEvt){
                // debugger;
                sap.m.MessageToast.show("CD Value Help pressed");
            },


            /**
             * 
             * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
             */
            onNavigation: function(oEvt){
                // debugger;
                // this.getView().getModel("modelMockData1").getProperty(oEvt.getSource().getBindingContextPath());
                sap.m.MessageToast.show(oEvt.getSource().getBindingContextPath());
                this.getOwnerComponent().getRouter().navTo("routeDetailPage");
            }
        });
	});
