define(["require", "exports", "../operators/zip"], function (require, exports, zip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* tslint:enable:max-line-length */
    /**
     * @param observables
     * @return {Observable<R>}
     * @method zip
     * @owner Observable
     */
    function zipProto() {
        var observables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i] = arguments[_i];
        }
        return zip_1.zip.apply(void 0, observables)(this);
    }
    exports.zipProto = zipProto;
});
//# sourceMappingURL=zip.js.map