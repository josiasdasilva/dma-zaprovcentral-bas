sap.ui.define([], function () {
	"use strict";
	return {
		textFormat: function(sStatus){
            switch (sStatus) {
                case "A": return "Aprovado";
                case "R": return "Reprovado";
                case "N": return "Aprovado";
                default: return "Verificar";
            }
		},
		statusFormat: function(sStatus){
            switch (sStatus) {
                //case "Aprovado":
                case "A": return "Success";
                //case "Reprovado":
                case "R": return "Error";
                //case "Não necessita":
                case "N": return "Success";
                //case Falta Aprovação
                default: return "None";
            }
		},
		iconFormat: function(sStatus){
            switch (sStatus) {
                //case "Aprovado":
                case "A": return "sap-icon://sys-enter-2";
                //case "Reprovado":
                case "R": return "sap-icon://sys-cancel-2";
                //case "Não necessita":
                case "N": return "sap-icon://sys-enter-2";
                //case Falta Aprovação
                default: return "sap-icon://sys-help-2";
            }
		},
    	dateFormat: function (a) {
			if (a !== null) {
				a = a.toLocaleString("pt-BR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit"
				});
			} else {
				a = "";
			}
			return a;
		}
	};
});