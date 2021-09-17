sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "dma/zaprovcentral/controller/BaseController",
    "sap/ui/core/routing/History",
    "dma/zaprovcentral/controller/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, History, Formatter, MessageBox, MessageToast){
	"use strict";

	return BaseController.extend("dma.zaprovcentral.controller.detailPage", {
        _detailTable: null,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf dma.zaprovcentral.view.detailPage
		 */
		onInit: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.handleRouteMatched, this);

            this._detailTable = this.getView().byId("idTable02");
		},


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf dma.zaprovcentral.view.detailPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},


		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf dma.zaprovcentral.view.detailPage
		 */
		//	onAfterRendering: function() {
		//
		//	},


		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf dma.zaprovcentral.view.detailPage
		 */
		//	onExit: function() {
		//
        //	}
        

        formatter: Formatter,


        /**
         * Handler que é acionado sempre que essa view é acessada pelo Router
         * Chama o método que aciona o serviço de geração do PDF
         * @public
         */
        handleRouteMatched: function(oEvt){
            // console.log(oEvt.getParameter("name"));
            if(oEvt.getParameter("name") !== "routeDetailPage"){
                return;
            }
            this.loadTableData();
        },


        /**
         * 
         */
        loadTableData: function(){

            const oModel = this.getView().getModel();
            const oSelectedLine = this.getView().getModel("modelTableSelectedLine").getData();

            let sObjectPath = oModel.createKey("/AprovPedidoSet", {
                Nroseq: oSelectedLine.Nroseq
            });

            this._detailTable.bindItems({
                path: `${sObjectPath}/AprovMaterialSet`,
                template: this._detailTable.getBindingInfo("items").template
            });

        },


        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado 
         */
        onLineSelection: function(oEvt){
/*
            // const oModel = this.getView().getModel("modelMockData1"),
            const oModel = this.getView().getModel(),
                  oItemsSelected = oEvt.getSource().getSelectedItems();
            let sSelectedItems = "";

            for(let sIndex in oItemsSelected){
                // sSelectedItems += oModel.getProperty(oItemsSelected[sIndex].getBindingContextPath()).NumItem + " / ";
                sSelectedItems += oModel.getProperty(oItemsSelected[sIndex].getBindingContextPath()).Nroseq + " / ";
            }

            if(sSelectedItems && sSelectedItems.length >= 3){
                sSelectedItems = sSelectedItems.slice(0, sSelectedItems.length - 3);
                sap.m.MessageToast.show(sSelectedItems);
            }
*/
        },
        

        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onPressButtonApprove: function(oEvt){
            let iIndexColunaQtd = -1,
                sPath = "";
            const bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
                  oColumns = this._detailTable.getAggregation("columns"),
                  oModel = this.getView().getModel(),
                  oSelectedItems = this._detailTable.getSelectedItems();
            const oParameters = {
                      "groupId": "massApproval",
                      "success": function(oData, oRes){
                          console.log(oRes);
                          
                          this._detailTable.removeSelections();

                          MessageBox.success(
                              `Registro(s) atualizado(s) com sucesso.`,
                              { styleClass: bCompact ? "sapUiSizeCompact" : "" }
                          );
                      }.bind(this),
                      "error": function(oError){
                          console.log(oError);
                          MessageBox.error(
                              `Erro ao atualizar o(s) registro(s):
                              ${oError}`,
                              { styleClass: bCompact ? "sapUiSizeCompact" : "" }
                          );
                      }
                  };
            
            //debugger;

            if(oSelectedItems.length > 0){
                for(let iIndex in oColumns){
                    if(oColumns[iIndex].getAggregation("header").getProperty("text") === "Quantidade Aprovada"){
                        iIndexColunaQtd = iIndex;
                        break;
                    }
                }

                if(iIndexColunaQtd >= 0){
                    oModel.setUseBatch(true);
                    oModel.setDeferredGroups(["massApproval"]);

                    for(let iIndex in oSelectedItems){
                        // console.log(oSelectedItems[iIndex].getAggregation("cells")[iIndexColunaQtd].getProperty("value"));

                        sPath = this.getView().byId("idTable02").getSelectedItems()[0].getBindingContextPath();

                        // Efetua update em "AprovMaterialSet" (batch)
                        oModel.update(
                            sPath,
                            {
                                "QtdeAprov": oSelectedItems[iIndex].getAggregation("cells")[iIndexColunaQtd].getProperty("value")
                            },
                            oParameters
                        );
                    }

                    oModel.submitChanges({
                        oParameters
                    });
                }else{
                    // Erro ao encontrar a coluna de "Quantidade Aprovada"
                }
            }else{
                MessageToast.show("É necessário selecionar ao menos um registro.",{
                    "duration": 4000
                })
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