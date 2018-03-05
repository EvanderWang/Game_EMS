define(["require", "exports", "../observable/ArrayObservable", "../observable/ScalarObservable", "../observable/EmptyObservable", "../observable/concat", "../util/isScheduler"], function (require, exports, ArrayObservable_1, ScalarObservable_1, EmptyObservable_1, concat_1, isScheduler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* tslint:enable:max-line-length */
    /**
     * Returns an Observable that emits the items you specify as arguments before it begins to emit
     * items emitted by the source Observable.
     *
     * <img src="./img/startWith.png" width="100%">
     *
     * @param {...T} values - Items you want the modified Observable to emit first.
     * @param {Scheduler} [scheduler] - A {@link IScheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable} An Observable that emits the items in the specified Iterable and then emits the items
     * emitted by the source Observable.
     * @method startWith
     * @owner Observable
     */
    function startWith() {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i] = arguments[_i];
        }
        return function (source) {
            var scheduler = array[array.length - 1];
            if (isScheduler_1.isScheduler(scheduler)) {
                array.pop();
            }
            else {
                scheduler = null;
            }
            var len = array.length;
            if (len === 1) {
                return concat_1.concat(new ScalarObservable_1.ScalarObservable(array[0], scheduler), source);
            }
            else if (len > 1) {
                return concat_1.concat(new ArrayObservable_1.ArrayObservable(array, scheduler), source);
            }
            else {
                return concat_1.concat(new EmptyObservable_1.EmptyObservable(scheduler), source);
            }
        };
    }
    exports.startWith = startWith;
});
//# sourceMappingURL=startWith.js.map