define(["require", "exports", "../operators/publishLast"], function (require, exports, publishLast_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @return {ConnectableObservable<T>}
     * @method publishLast
     * @owner Observable
     */
    function publishLast() {
        //TODO(benlesh): correct type-flow through here.
        return publishLast_1.publishLast()(this);
    }
    exports.publishLast = publishLast;
});
//# sourceMappingURL=publishLast.js.map