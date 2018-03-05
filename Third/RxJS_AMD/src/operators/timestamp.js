define(["require", "exports", "../scheduler/async", "./map"], function (require, exports, async_1, map_1) {
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
        return map_1.map(function (value) { return new Timestamp(value, scheduler.now()); });
        // return (source: Observable<T>) => source.lift(new TimestampOperator(scheduler));
    }
    exports.timestamp = timestamp;
    var Timestamp = (function () {
        function Timestamp(value, timestamp) {
            this.value = value;
            this.timestamp = timestamp;
        }
        return Timestamp;
    }());
    exports.Timestamp = Timestamp;
    ;
});
//# sourceMappingURL=timestamp.js.map