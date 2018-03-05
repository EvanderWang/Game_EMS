define(["require", "exports", "../scheduler/async", "../operators/timeInterval"], function (require, exports, async_1, timeInterval_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimeInterval = timeInterval_1.TimeInterval;
    /**
     * @param scheduler
     * @return {Observable<TimeInterval<any>>|WebSocketSubject<T>|Observable<T>}
     * @method timeInterval
     * @owner Observable
     */
    function timeInterval(scheduler) {
        if (scheduler === void 0) { scheduler = async_1.async; }
        return timeInterval_1.timeInterval(scheduler)(this);
    }
    exports.timeInterval = timeInterval;
});
//# sourceMappingURL=timeInterval.js.map