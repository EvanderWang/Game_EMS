define(["require", "exports", "../scheduler/async", "../util/isNumeric", "../util/isScheduler", "../operators/windowTime"], function (require, exports, async_1, isNumeric_1, isScheduler_1, windowTime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function windowTime(windowTimeSpan) {
        var scheduler = async_1.async;
        var windowCreationInterval = null;
        var maxWindowSize = Number.POSITIVE_INFINITY;
        if (isScheduler_1.isScheduler(arguments[3])) {
            scheduler = arguments[3];
        }
        if (isScheduler_1.isScheduler(arguments[2])) {
            scheduler = arguments[2];
        }
        else if (isNumeric_1.isNumeric(arguments[2])) {
            maxWindowSize = arguments[2];
        }
        if (isScheduler_1.isScheduler(arguments[1])) {
            scheduler = arguments[1];
        }
        else if (isNumeric_1.isNumeric(arguments[1])) {
            windowCreationInterval = arguments[1];
        }
        return windowTime_1.windowTime(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler)(this);
    }
    exports.windowTime = windowTime;
});
//# sourceMappingURL=windowTime.js.map