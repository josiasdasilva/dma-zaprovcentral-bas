sap.ui.define([], function () {
	"use strict";
	return {
		statusFormat: function(sStatus){
            switch (sStatus) {
                case "Aprovado":
                    return sap.ui.core.ValueState.Success;
                    break;

                case "Reprovado":
                    return sap.ui.core.ValueState.Error;
                    break;

                case "Pendente":
                    return sap.ui.core.ValueState.None;
                    break;

                default:
                    return sap.ui.core.ValueState.None;
                    break;
            }
		}
	};
});