define(["require", "exports", "../scheduler/async", "../operators/timestamp"], function (require, exports, async_1, timestamp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @param scheduler
     * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
     * @method timestamp
     * @owner Observable
     */
    function timestamp(scheduler) {
        if (scheduler === void 0) { scheduler = async_1.async; }
        return timestamp_1.timestamp(scheduler)(this);
    }
    exports.timestamp = timestamp;
});
//# sourceMappingURL=timestamp.js.map