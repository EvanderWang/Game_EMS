define(["require", "exports", "../../Observable", "../../operator/do"], function (require, exports, Observable_1, do_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Observable_1.Observable.prototype.do = do_1._do;
    Observable_1.Observable.prototype._do = do_1._do;
});
//# sourceMappingURL=do.js.map