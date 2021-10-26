sap.ui.define([], function () {
	"use strict";
	return {
		statusFormat: function(sStatus){
            switch (sStatus) {
                //case "Aprovado":
                case "A":
                    return sap.ui.core.ValueState.Success;
                    // break;

                //case "Reprovado":
                case "R":
                    return sap.ui.core.ValueState.Error;
                    // break;

                //case "Pendente":
                case "N":
                case "P":
                    return sap.ui.core.ValueState.None;
                    // break;

                default:
                    return sap.ui.core.ValueState.None;
                    // break;
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