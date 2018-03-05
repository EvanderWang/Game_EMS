define(["require", "exports", "../../Observable", "../../operator/mergeMapTo"], function (require, exports, Observable_1, mergeMapTo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Observable_1.Observable.prototype.flatMapTo = mergeMapTo_1.mergeMapTo;
    Observable_1.Observable.prototype.mergeMapTo = mergeMapTo_1.mergeMapTo;
});
//# sourceMappingURL=mergeMapTo.js.map