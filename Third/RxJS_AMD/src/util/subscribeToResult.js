define(["require", "exports", "./root", "./isArrayLike", "./isPromise", "./isObject", "../Observable", "../symbol/iterator", "../InnerSubscriber", "../symbol/observable"], function (require, exports, root_1, isArrayLike_1, isPromise_1, isObject_1, Observable_1, iterator_1, InnerSubscriber_1, observable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
        var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        if (destination.closed) {
            return null;
        }
        if (result instanceof Observable_1.Observable) {
            if (result._isScalar) {
                destination.next(result.value);
                destination.complete();
                return null;
            }
            else {
                destination.syncErrorThrowable = true;
                return result.subscribe(destination);
            }
        }
        else if (isArrayLike_1.isArrayLike(result)) {
            for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
                destination.next(result[i]);
            }
            if (!destination.closed) {
                destination.complete();
            }
        }
        else if (isPromise_1.isPromise(result)) {
            result.then(function (value) {
                if (!destination.closed) {
                    destination.next(value);
                    destination.complete();
                }
            }, function (err) { return destination.error(err); })
                .then(null, function (err) {
                // Escaping the Promise trap: globally throw unhandled errors
                root_1.root.setTimeout(function () { throw err; });
            });
            return destination;
        }
        else if (result && typeof result[iterator_1.iterator] === 'function') {
            var iterator = result[iterator_1.iterator]();
            do {
                var item = iterator.next();
                if (item.done) {
                    destination.complete();
                    break;
                }
                destination.next(item.value);
                if (destination.closed) {
                    break;
                }
            } while (true);
        }
        else if (result && typeof result[observable_1.observable] === 'function') {
            var obs = result[observable_1.observable]();
            if (typeof obs.subscribe !== 'function') {
                destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
            }
            else {
                return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
            }
        }
        else {
            var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = "You provided " + value + " where a stream was expected."
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            destination.error(new TypeError(msg));
        }
        return null;
    }
    exports.subscribeToResult = subscribeToResult;
});
//# sourceMappingURL=subscribeToResult.js.map