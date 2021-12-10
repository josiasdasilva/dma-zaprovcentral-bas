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
            this.initWSocket();
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
        
        onCriaPedido: function (oEvent) {
            var oView = this.getView();
            this.onOpenPedidoProgressDialog();
            var localModel = this.getView().getModel();
            var sObjectPath = localModel.createKey('/POCriaSet', {
                Id: this.getView().getModel("modelTableSelectedLine").getData().Nroseq,
                Ekgrp: this.getView().getModel("modelTableSelectedLine").getData().Ekgrp,
                Lifnr: this.getView().getModel("modelTableSelectedLine").getData().Lifnr
            });
            localModel.read(sObjectPath, {
                method: 'GET',
                success: (oData2, oResponse) => {
                    sap.ui.core.BusyIndicator.hide();
                    this.idMessage = oData2.Mensagem;
                    return;
                },
                error: (oError) => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageBox.error('Erro', {
                        title: this.getText('pedido_nao_criado'),
                        initialFocus: null,
                        styleClass: sResponsivePaddingClasses,
                    });
                },
            });
        },
        /* Diálogo Pedidos Criados */
        dialogoCriaPedido: function (oData2, pNroSeq) {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel(oData2),
                'PedCriado'
            );
            var aFilters = [];
            if (!this._PedCriadoDialog) {
                this._PedCriadoDialog = sap.ui.xmlfragment(
                    'dma.zaprovcentral.view.fragments.ped_criado',
                    this
                );
                this.getView().addDependent(this._PedCriadoDialog);
            }
            this._PedCriadoDialog.open();
        },
        /**
         * 
         * @param {sap.ui.base.Event} oEvt - Dados do evento acionado
         */
        // onPressButtonApprove: function(oEvt){
        onPressButtonApproveDisapprove: function(oEvt){
            let cStatus = "",
                iIndexColunaQtd = -1,
                iIndexColunaMatnr = -1,
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
            
            if(oEvt.getParameter("id").search("idButtonApprove") >= 0){
                cStatus = "A";
            }else if(oEvt.getParameter("id").search("idButtonDisapprove") >= 0){
                cStatus = "R";
            }

            if(oSelectedItems.length > 0){
                for(let iIndex in oColumns){
                    if(oColumns[iIndex].getAggregation("header").getProperty("text") === "Quantidade Aprovada"){
                        iIndexColunaQtd = iIndex;
                    }
                    if(oColumns[iIndex].getAggregation("header").getProperty("text") === "Material"){
                        iIndexColunaMatnr = iIndex;
                    }
                }

                if(iIndexColunaQtd >= 0){
                    const oSelectedLine = this.getView().getModel("modelTableSelectedLine").getData();

                    oModel.setUseBatch(true);
                    oModel.setDeferredGroups(["massApproval"]);

                    for(let iIndex in oSelectedItems){
                        // console.log(oSelectedItems[iIndex].getAggregation("cells")[iIndexColunaQtd].getProperty("value"));

                        sPath = this.getView().byId("idTable02").getSelectedItems()[0].getBindingContextPath();

                        // Efetua update em "AprovMaterialSet" (batch)
                        oModel.update(
                            sPath,
                            {
                                "Nroseq": oSelectedLine.Nroseq,
                                "Matnr": oSelectedItems[iIndex].getAggregation("cells")[iIndexColunaMatnr].getBindingInfo("text").binding.aValues[0],
                                "QtdeAprov": oSelectedItems[iIndex].getAggregation("cells")[iIndexColunaQtd].getProperty("value"),
                                "Status": cStatus
                            },
                            oParameters
                        );
                    }

                    oModel.submitChanges(
                        //oParameters
                    );
                }else{
                    // Erro ao encontrar a coluna de "Quantidade Aprovada"
                }
            }else{
                MessageToast.show("É necessário selecionar ao menos um registro.",{
                    "duration": 4000
                })
            }
        },

        enableCriaPedido: function(oEvt){
            let iIndexColunaStatus = -1,
                iStatusValue = "";
             const oColumns = this._detailTable.getAggregation("columns"),
                   oAllItems = this._detailTable.getItems();
            if(oAllItems.length > 0){
                for(let iIndex in oColumns){
                    if(oColumns[iIndex].getAggregation("header").getProperty("text") === "Status"){
                        iIndexColunaStatus = iIndex;
                    }
                }

                this.byId('botaoCriaPedido').setEnabled(true);
                for(let iIndex in oAllItems){
                    iStatusValue = oAllItems[iIndex].getAggregation("cells")[iIndexColunaStatus].getBindingInfo("text").binding.getValue();
                    if (iStatusValue === ""){
                        this.byId('botaoCriaPedido').setEnabled(false);
                    }
                }
            }
        },
        _handlePedCriadoPrint: function (oEvent) {
            var globalModel = this.getModel('globalModel');
            var localModel = this.getModel();

            var tbl_items = this._PedCriadoDialog.getContent()[0].getItems();
            var sEbeln = '';
            for (var i = 0; i < tbl_items.length; i++) {
                if (i !== 0) {
                    sEbeln = sEbeln + ',';
                }
                sEbeln =
                    sEbeln +
                    tbl_items[i].getAggregation('cells')[0].getProperty('text');
            }
            // var sObjectPath = localModel.createKey('/PrnPedido', {
            var sObjectPath = localModel.createKey('/PrnPedidoSet', {
                Ebeln: sEbeln,
            });
            var sURL = localModel.sServiceUrl + sObjectPath + '/$value';
            window.open(sURL, '_blank');
        },
        _handlePedCriadoEmail: function (oEvent) {
            var globalModel = this.getModel('globalModel');
            var localModel = this.getModel();
            var aFilters = [];

            var tbl_items = this._PedCriadoDialog.getContent()[0].getItems();
            var sEbeln = '';
            for (var i = 0; i < tbl_items.length; i++) {
                if (i !== 0) {
                    sEbeln = sEbeln + ',';
                }
                sEbeln =
                    sEbeln +
                    tbl_items[i].getAggregation('cells')[0].getProperty('text');
            }
            aFilters.push(
                new sap.ui.model.Filter(
                    'Ebeln',
                    sap.ui.model.FilterOperator.EQ,
                    sEbeln
                )
            );
            aFilters.push(
                new sap.ui.model.Filter(
                    'emailComprador',
                    sap.ui.model.FilterOperator.EQ,
                    sap.ui.getCore().byId('idPopoverEmail--emailComprador').getValue()
                )
            );
            aFilters.push(
                new sap.ui.model.Filter(
                    'ckbComprador',
                    sap.ui.model.FilterOperator.EQ,
                    sap.ui.getCore().byId('idPopoverEmail--ckbComprador').getSelected()
                )
            );
            aFilters.push(
                new sap.ui.model.Filter(
                    'emailFornecedor',
                    sap.ui.model.FilterOperator.EQ,
                    sap.ui.getCore().byId('idPopoverEmail--emailFornecedor').getValue()
                )
            );
            aFilters.push(
                new sap.ui.model.Filter(
                    'ckbFornecedor',
                    sap.ui.model.FilterOperator.EQ,
                    sap.ui.getCore().byId('idPopoverEmail--ckbFornecedor').getSelected()
                )
            );
            aFilters.push(
                new sap.ui.model.Filter(
                    'ckbLojas',
                    sap.ui.model.FilterOperator.EQ,
                    sap.ui.getCore().byId('idPopoverEmail--ckbLojas').getSelected()
                )
            );
            sap.ui.core.BusyIndicator.show();
            // localModel.read('/MailPedidoSend', {
            localModel.read('/MailPedidoSendSet', {
                method: 'GET',
                filters: aFilters,
                success: function (oData2, oResponse) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageBox.success(this.getText('email_sucesso'), {
                        title: 'Email',
                        actions: [MessageBox.Action.OK],
                        initialFocus: MessageBox.Action.OK,
                        styleClass: sResponsivePaddingClasses,
                    });
                },
                error: function (oError) { },
            });
        },
        _openPedCriadoEmail: function (oEvent) {
            var oButton = oEvent.getSource();
            if (!this._popoverEmail) {
                this._popoverEmail = sap.ui.xmlfragment(
                    'idPopoverEmail',
                    'dma.zaprovcentral.view.fragments.popoverEmail',
                    this
                );
                this.getView().addDependent(this._popoverEmail);
            }

            var globalModel = this.getModel('globalModel');
            var localModel = this.getModel();
            // var sObjectPath = localModel.createKey('/MailPedidoGet', {
            var sObjectPath = localModel.createKey('/MailPedidoGetSet', {
                Ekgrp: globalModel.getProperty('/Ekgrp'),
                Lifnr: globalModel.getProperty('/Lifnr'),
            });

            localModel.read(sObjectPath, {
                method: 'GET',
                success: function (oData2, oResponse) {
                    //cabec.setNumber({ path: oData2.Total, formatter: '.format.currencyValue' });
                    sap.ui
                        .getCore()
                        .byId('idPopoverEmail--emailComprador')
                        .setValue(oData2.Comprador);
                    sap.ui
                        .getCore()
                        .byId('idPopoverEmail--emailFornecedor')
                        .setValue(oData2.Fornecedor);
                },
                error: function (oError) { },
            });

            this._popoverEmail.openBy(oButton);
        },
        _handlePedCriadoClose: function (oEvent) {
            var globalModel = this.getModel('globalModel');
            this.getRouter().navTo('busca', {
                Ekgrp: globalModel.getProperty('/Ekgrp'),
                Uname: globalModel.getProperty('/Uname'),
                Lifnr: '',
            });
        },

        setMessagePedidoProgressDialog: function (sText) {
            this.getView().getModel('pedidoProgress').setProperty('/text', sText);
        },

        onOpenPedidoProgressDialog: function (oEvent) {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({ text: '' }),
                'pedidoProgress'
            );
            // instantiate dialog
            if (!this._pedidoBusyDialog) {
                this._pedidoBusyDialog = sap.ui.xmlfragment(
                    'dma.zaprovcentral.view.fragments.PedidoProgressBusyDialog',
                    this
                );
                this.getView().addDependent(this._pedidoBusyDialog);
            }

            // open dialog
            jQuery.sap.syncStyleClass(
                'sapUiSizeCompact',
                this.getView(),
                this._pedidoBusyDialog
            );
            this._pedidoBusyDialog.open();

            // simulate end of operation
            /*_timeout = jQuery.sap.delayedCall(10000, this, function () {
                    this._pedidoBusyDialog.close();
                });*/
        },

        onPedidoProgressDialogClosed: function (oEvent) { },

        initWSocket: function () {
            let hostLocation = window.location,
                socket,
                socketHostURI,
                webSocketURI;
            if (hostLocation.protocol === 'https:') {
                socketHostURI = 'wss:';
            } else {
                socketHostURI = 'ws:';
            }
            socketHostURI += '//' + hostLocation.host;
            webSocketURI = socketHostURI + '/sap/bc/apc/sap/zcockpit_central';

            try {
                socket = new WebSocket(webSocketURI);
                socket.onopen = (e) => {
                    console.log('Connected');
                };
                socket.onerror = (e) => {
                    console.log('Erro');
                };

                //Create function for handling websocket messages
                socket.onmessage = (oMsg) => {
                    let oMessage = JSON.parse(oMsg.data);
                    if (oMessage.idMessage !== this.idMessage) {
                        return;
                    }

                    if (
                        oMessage.message &&
                        oMessage.message.length > 0 &&
                        oMessage.failed
                    ) {
                        sap.m.MessageBox.error(
                            this.getText('erro_criacao_pedido') + '\n' + oMessage.message, {
                            title: this.getText('pedido_nao_criado'),
                            actions: [MessageBox.Action.OK],
                            initialFocus: MessageBox.Action.OK,
                            styleClass: sResponsivePaddingClasses,
                        }
                        );
                        return;
                    }

                    if (oMessage.complete) {
                        this._pedidoBusyDialog.close();
                        this.dialogoCriaPedido(oMessage.list, null);
                    } else {
                        this.setMessagePedidoProgressDialog(
                            this.getTextWithParams('pedido_status', [
                                oMessage.createdCount.toString(),
                                oMessage.totalCount.toString(),
                            ])
                        );
                    }
                };
                socket.onclose = (e) => {
                    console.log('Closed');
                };
            } catch (exception) { }
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