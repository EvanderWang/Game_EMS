define(["require", "exports", "../Observable"], function (require, exports, Observable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // HACK: this is here for backward compatability
    // TODO(benlesh): remove this in v6.
    exports.toPromise = Observable_1.Observable.prototype.toPromise;
});
//# sourceMappingURL=toPromise.js.map