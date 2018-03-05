define(["require", "exports", "../operators/zipAll"], function (require, exports, zipAll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @param project
     * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
     * @method zipAll
     * @owner Observable
     */
    function zipAll(project) {
        return zipAll_1.zipAll(project)(this);
    }
    exports.zipAll = zipAll;
});
//# sourceMappingURL=zipAll.js.map