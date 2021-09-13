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


        /**
         * Retorna os possíveis tipos para utilizar no Token
         * @public
         * @returns {JSON} Objeto JSON com os possíveis tipos para Tokens
         */
        getFromType: function(){
            return {
                "TITLE"         : "0",
                "DESCRIPTION"   : "1"
            }
        },


        /**
         * Acionado quando o SelectDialog é fechado, efetuando a lógica de atualizar os dados no Input
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         * @param {string} sId - ID do MultiInput
         * @param {string} sTextGetFrom - Define qual propriedade vai ser utilizada na propriedade "text" do
         * Token (valor padrão = this.getFromType().DESCRIPTION)
         */
        onValueHelpCloseInput: function(oEvt, sId){
            let aSelectedContexts   = oEvt.getParameter("selectedContexts");
            let oModel              = this.getView().getModel(),
                oInput              = this.byId(sId),
                oSelectedItem       = oEvt.getParameter("selectedItem");

            if(aSelectedContexts && aSelectedContexts.length > 0){
                oInput.setValue(
                    oModel.getProperty(
                        aSelectedContexts[0].getPath()
                    )[oSelectedItem.getBinding("title").getPath()]
                );
            }
        },


        /**
         * Acionado quando o SelectDialog é fechado, efetuando a lógica de atualizar os dados no MultiInput
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         * @param {string} sId - ID do MultiInput
         * @param {string} sTextGetFrom - Define qual propriedade vai ser utilizada na propriedade "text" do
         * Token (valor padrão = this.getFromType().DESCRIPTION)
         */
        onValueHelpCloseMultiInput: function(oEvt, sId, sTextGetFrom = this.getFromType().DESCRIPTION){
/*
            let aSelectedItems = oEvt.getParameter("selectedItems");
            let enumFromType = this.getFromType();
            let oMultiInput = this.byId(sId);
            let sTextGetFromValue;

            oMultiInput.removeAllTokens();

            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    switch(sTextGetFrom){
                        case enumFromType.TITLE:
                            sTextGetFromValue = oItem.getTitle();
                            break;
                        case enumFromType.DESCRIPTION:
                            sTextGetFromValue = oItem.getDescription();
                            break;
                        default:
                            break;
                    }

                    oMultiInput.addToken(
                        new Token(
                            {
                                key: oItem.getTitle(),
                                text: sTextGetFromValue
                            }
                        )
                    );
                });
            }
*/
            let aSelectedContexts   = oEvt.getParameter("selectedContexts");
            let enumFromType        = this.getFromType();
            let oModel              = this.getView().getModel(),
                oMultiInput         = this.byId(sId),
                oSelectedItem       = oEvt.getParameter("selectedItem");
            let sTextGetFromValue;

            oMultiInput.removeAllTokens();

            if(aSelectedContexts && aSelectedContexts.length > 0){
                aSelectedContexts.forEach(function(oItem){
                    switch(sTextGetFrom){
                        case enumFromType.TITLE:
                            sTextGetFromValue = oModel.getProperty(oItem.getPath())[oSelectedItem.getBinding("title").getPath()];
                            break;
                        case enumFromType.DESCRIPTION:
                            sTextGetFromValue = oModel.getProperty(oItem.getPath())[oSelectedItem.getBinding("description").getPath()];
                            break;
                        default:
                            break;
                    }
                    
                    oMultiInput.addToken(
                        new Token(
                            {
                                key: oModel.getProperty(oItem.getPath())[oSelectedItem.getBinding("title").getPath()],
                                text: sTextGetFromValue
                            }
                        )
                    );
                });
            }
        },


        /**
         * Obtém os dados do MultiInput e atualiza quais dados da lista no SelectDialog estão selecionados
         * @public
         * @param {string} sId - ID do MultiInput
         * @param {sap.ui.core.Control} oDialog - Objeto de dialog
         */
        onValueHelpRememberSelections: function(sId, oDialog){
            let aInput = this.getView().byId(sId).getTokens();
            let aValues = oDialog._oList.getItems();
            
            for(let iIndexInput in aInput){
                for(let iIndexValues in aValues){
                    if(aInput[iIndexInput].getKey() === aValues[iIndexValues].getTitle()){
                        aValues[iIndexValues].setSelected(true);
                    }
                }
            }
        },
    });
});