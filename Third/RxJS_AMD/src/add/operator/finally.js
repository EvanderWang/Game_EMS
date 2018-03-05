define(["require", "exports", "../../Observable", "../../operator/finally"], function (require, exports, Observable_1, finally_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Observable_1.Observable.prototype.finally = finally_1._finally;
    Observable_1.Observable.prototype._finally = finally_1._finally;
});
//# sourceMappingURL=finally.js.map