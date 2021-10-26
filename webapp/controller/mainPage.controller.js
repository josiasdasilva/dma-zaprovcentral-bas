sap.ui.define([
    // "sap/ui/core/mvc/Controller"
    "dma/zaprovcentral/controller/BaseController",
    "dma/zaprovcentral/controller/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController, Formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dma.zaprovcentral.controller.mainPage", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf dma.zaprovcentral.view.mainPage
         */
        onInit: function () {
            
        },


        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf dma.zaprovcentral.view.mainPage
         */
        //	onBeforeRendering: function() {
        //
        //	},


        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf dma.zaprovcentral.view.mainPage
         */
        //	onAfterRendering: function() {
        //
        //	},


        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf dma.zaprovcentral.view.mainPage
         */
        //	onExit: function() {
        //
        //	}


        formatter: Formatter,


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


//----------------------------------------------------------------------//
// Centro de Distribuição                                               //
//----------------------------------------------------------------------//
        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpRequestCd: function(oEvt){
            //debugger;
            sap.m.MessageToast.show("CD Value Help pressed");
        },


//----------------------------------------------------------------------//
// Comprador                                                            //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idInputComprador01", onde é acionado o
         * fragmento "ShComprador".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpRequestComprador: function(oEvt){
            //debugger;
            const oField = sap.ui.getCore().byId(oEvt.getParameter("id"));
            // sap.m.MessageToast.show("Comprador Value Help pressed");

            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShCompradorDialog) {
                this._ShCompradorDialog = sap.ui.xmlfragment("dma.zaprovcentral.view.fragments.ShComprador", this);
                this.getView().addDependent(this._ShCompradorDialog);
            }

            //this.onValueHelpRememberSelections("idMultiInputComprador01", this._ShCompradorDialog);
            
            this.onValueHelpCompradorPreFilter(oEvt);

            this._ShCompradorDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idInputComprador01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorPreFilter: function(oEvt){
            //debugger;
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idInputComprador01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorSearch: function(oEvt){
            //debugger;

            let aFilters    = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            if(sValue){
                // oFilter = new Filter("Ekgrp", FilterOperator.Contains, sValue);
                // aFilters.push(oFilter);

                oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
                aFilters.push(oFilter);

                // oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
                oBinding.filter(aFilters);
            }else{
                oBinding.filter([]);
            }
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idInputComprador01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorCancel: function(oEvt){
            //debugger;
        },


        /**
         * Aplica no campo "idInputComprador01" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpCompradorClose: function(oEvt){
            //debugger;
            this.onValueHelpCloseInput(oEvt, "idInputComprador01");
        },


        // ********************** //
        // LÓGICA PARA MULTIINPUT //
        // ********************** //
        // /**
        //  * Evento acionado ao abrir o Search Help do campo "idMultiInputComprador01", onde é acionado o
        //  * fragmento "ShComprador".
        //  * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
        //  * que tem interdependência.
        //  * @public
        //  * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
        //  */
        // onValueHelpRequestComprador: function(oEvt){
        //     //debugger;
        //     const oField = sap.ui.getCore().byId(oEvt.getParameter("id"));
        //     sap.m.MessageToast.show("Comprador Value Help pressed");

        //     // Cria o fragmento (ajuda de pesquisa)
        //     if (!this._ShCompradorDialog) {
        //         this._ShCompradorDialog = sap.ui.xmlfragment("dma.zaprovcentral.view.fragments.ShComprador", this);
        //         this.getView().addDependent(this._ShCompradorDialog);
        //     }

        //     this.onValueHelpRememberSelections("idMultiInputComprador01", this._ShCompradorDialog);
            
        //     this.onValueHelpCompradorPreFilter(oEvt);

        //     this._ShCompradorDialog.open();
        // },


        // /**
        //  * Aplica os filtros dos campos que tem interdependência para o campo "idMultiInputComprador01".
        //  * @public
        //  * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
        //  */
        // onValueHelpCompradorPreFilter: function(oEvt){
        //     //debugger;
        // },


        // /**
        //  * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputComprador01".
        //  * @public
        //  * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
        //  */
        // onValueHelpCompradorSearch: function(oEvt){
        //     debugger;

        //     let aFilters    = [];
        //     let oBinding    = oEvt.getSource().getBinding("items"),
        //         oFilter     = {};
        //     let sValue      = oEvt.getParameter("value").toUpperCase();

        //     if(sValue){
        //         // oFilter = new Filter("Ekgrp", FilterOperator.Contains, sValue);
        //         // aFilters.push(oFilter);

        //         oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
        //         aFilters.push(oFilter);

        //         // oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
        //         oBinding.filter(aFilters);
        //     }else{
        //         oBinding.filter([]);
        //     }
        // },


        // /**
        //  * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idMultiInputComprador01".
        //  * @public
        //  * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
        //  */
        // onValueHelpCompradorCancel: function(oEvt){
        //     //debugger;
        // },


        // /**
        //  * Aplica no campo "idMultiInputComprador01" os valores selecionados no "SelectDialog" do fragmento.
        //  * @public
        //  * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
        //  */
        // onValueHelpCompradorClose: function(oEvt){
        //     //debugger;
        //     this.onValueHelpCloseMultiInput(oEvt, "idMultiInputComprador01", this.getFromType().TITLE);
        // },


//----------------------------------------------------------------------//
// Fornecedor                                                           //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idInputFornecedor01", onde é acionado o
         * fragmento "ShFornecedor".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpRequestFornecedor: function(oEvt){
            //debugger;
            const oField = sap.ui.getCore().byId(oEvt.getParameter("id"));
            // sap.m.MessageToast.show("Fornecedor Value Help pressed");

            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShFornecedorDialog) {
                this._ShFornecedorDialog = sap.ui.xmlfragment("dma.zaprovcentral.view.fragments.ShFornecedor", this);
                this.getView().addDependent(this._ShFornecedorDialog);
            }

            this.onValueHelpFornecedorPreFilter(oEvt);

            this._ShFornecedorDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idInputFornecedor01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorPreFilter: function(oEvt){
            //debugger;
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idInputFornecedor01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorSearch: function(oEvt){
            //debugger;

            let aFilters    = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            if(sValue){
                // oFilter = new Filter("Lifnr", FilterOperator.Contains, sValue);
                // aFilters.push(oFilter);

                oFilter = new Filter("Mcod1", FilterOperator.Contains, sValue);
                aFilters.push(oFilter);

                // oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
                oBinding.filter(aFilters);
            }else{
                oBinding.filter([]);
            }
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idInputFornecedor01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorCancel: function(oEvt){
            //debugger;
        },


        /**
         * Aplica no campo "idInputFornecedor01" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpFornecedorClose: function(oEvt){
            //debugger;
            this.onValueHelpCloseInput(oEvt, "idInputFornecedor01");
        },


//----------------------------------------------------------------------//
// Nº Controle                                                          //
//----------------------------------------------------------------------//
        /**
         * Evento acionado ao abrir o Search Help do campo "idInputNumControle01", onde é acionado o
         * fragmento "ShNumControle".
         * Carrega os dados previamente selecionados no "SelectDialog" e aplica filtro dos campos
         * que tem interdependência.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpRequestNumControle: function(oEvt){
            //debugger;
            const oField = sap.ui.getCore().byId(oEvt.getParameter("id"));
            // sap.m.MessageToast.show("NumControle Value Help pressed");

            // Cria o fragmento (ajuda de pesquisa)
            if (!this._ShNumControleDialog) {
                this._ShNumControleDialog = sap.ui.xmlfragment("dma.zaprovcentral.view.fragments.ShNumControle", this);
                this.getView().addDependent(this._ShNumControleDialog);
            }

            //this.onValueHelpRememberSelections("idMultiInputNumControle01", this._ShNumControleDialog);
            
            this.onValueHelpNumControlePreFilter(oEvt);

            this._ShNumControleDialog.open();
        },


        /**
         * Aplica os filtros dos campos que tem interdependência para o campo "idInputNumControle01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpNumControlePreFilter: function(oEvt){
            //debugger;
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idInputNumControle01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpNumControleSearch: function(oEvt){
            //debugger;

            let aFilters    = [];
            let oBinding    = oEvt.getSource().getBinding("items"),
                oFilter     = {};
            let sValue      = oEvt.getParameter("value").toUpperCase();

            if(sValue){
                // oFilter = new Filter("Ekgrp", FilterOperator.Contains, sValue);
                // aFilters.push(oFilter);

                oFilter = new Filter("Nome", FilterOperator.Contains, sValue);
                aFilters.push(oFilter);

                // oBinding.filter(new Filter(aFilters, true)); // Multiple filter (array) / Second parameter (true = AND operator / false = OR operator)
                oBinding.filter(aFilters);
            }else{
                oBinding.filter([]);
            }
        },


        /**
         * Evento acionado ao clicar no botão "Cancelar" do "SelectDialog" do campo "idInputNumControle01".
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpNumControleCancel: function(oEvt){
            //debugger;
        },


        /**
         * Aplica no campo "idInputNumControle01" os valores selecionados no "SelectDialog" do fragmento.
         * @public
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onValueHelpNumControleClose: function(oEvt){
            //debugger;
            this.onValueHelpCloseInput(oEvt, "idInputNumControle01");
        },


        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onSearch: function(oEvt){
            let     aField = [];
            const   aFilters = [],
                    aInputs = [],
                    oTable = this.getView().byId("idTable01"),
                    oTableItems = oTable.getBinding("items");
            
            aField = [];
            aField.push("Nroseq");
            aField.push(FilterOperator.Contains);
            aField.push(this.getView().byId("idInputNumControle01").getValue());
            aInputs.push(aField);

            aField = [];
            aField.push("Ekgrp");
            aField.push(FilterOperator.Contains);
            aField.push(this.getView().byId("idInputComprador01").getValue());
            aInputs.push(aField);

            aField = [];
            aField.push("DataPed");
            aField.push(FilterOperator.EQ);
            aField.push(this.getView().byId("idDatePickerDataPedido01").getDateValue());
            aInputs.push(aField);

            aField = [];
            aField.push("Lifnr");
            aField.push(FilterOperator.Contains);
            aField.push(this.getView().byId("idInputFornecedor01").getValue());
            aInputs.push(aField);

            aField = [];
            aField.push("Status");
            aField.push(FilterOperator.Contains);
            aField.push(this.getView().byId("idComboBoxStatus01").getSelectedKey());
            aInputs.push(aField);

            for(let iIndexInputs in aInputs){
                if(aInputs[iIndexInputs][2]){
                    aFilters.push(new Filter(aInputs[iIndexInputs][0], aInputs[iIndexInputs][1], aInputs[iIndexInputs][2]));
                }
            }

            if(aFilters.length > 0){
                oTableItems.filter(aFilters);
            }else{
                oTableItems.filter([]);
            }
        },
        
        
        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        onNavigation: function(oEvt){
            const oModel = this.getView().getModel();
            
            //debugger;
            
            // this.getView().getModel("modelMockData1").getProperty(oEvt.getSource().getBindingContextPath());

            // sap.m.MessageToast.show(oEvt.getSource().getBindingContextPath());
            // this.getOwnerComponent().getRouter().navTo("routeDetailPage");

            let oSelectedLine = this.getView().getModel().getProperty(oEvt.getSource().getBindingContextPath());
            this.getView().getModel("modelTableSelectedLine").setData(oSelectedLine);

            this.getOwnerComponent().getRouter().navTo("routeDetailPage");

/*
            let sObjectPath = oModel.createKey("/AprovPedidoSet", {
                Nroseq: oSelectedLine.Nroseq,
                // Matnr: ""
            });

            oModel.read(sObjectPath + "/AprovMaterialSet", {
                method: "GET",
                success: (oData, oResponse) => {
                    this.getOwnerComponent().getRouter().navTo("routeDetailPage");
                },
                error: (oError) => {
                    // mensagem de erro
                }
            });
*/
        }
    });
});
