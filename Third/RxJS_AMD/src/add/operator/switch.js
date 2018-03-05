define(["require", "exports", "../../Observable", "../../operator/switch"], function (require, exports, Observable_1, switch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Observable_1.Observable.prototype.switch = switch_1._switch;
    Observable_1.Observable.prototype._switch = switch_1._switch;
});
//# sourceMappingURL=switch.js.map