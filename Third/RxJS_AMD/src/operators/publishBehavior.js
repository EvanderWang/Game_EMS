define(["require", "exports", "../BehaviorSubject", "./multicast"], function (require, exports, BehaviorSubject_1, multicast_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @param value
     * @return {ConnectableObservable<T>}
     * @method publishBehavior
     * @owner Observable
     */
    function publishBehavior(value) {
        return function (source) { return multicast_1.multicast(new BehaviorSubject_1.BehaviorSubject(value))(source); };
    }
    exports.publishBehavior = publishBehavior;
});
//# sourceMappingURL=publishBehavior.js.map