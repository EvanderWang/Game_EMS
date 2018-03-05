define(["require", "exports", "../operators/publishBehavior"], function (require, exports, publishBehavior_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @param value
     * @return {ConnectableObservable<T>}
     * @method publishBehavior
     * @owner Observable
     */
    function publishBehavior(value) {
        return publishBehavior_1.publishBehavior(value)(this);
    }
    exports.publishBehavior = publishBehavior;
});
//# sourceMappingURL=publishBehavior.js.map