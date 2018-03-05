var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../Subscriber"], function (require, exports, Subscriber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function refCount() {
        return function refCountOperatorFunction(source) {
            return source.lift(new RefCountOperator(source));
        };
    }
    exports.refCount = refCount;
    var RefCountOperator = (function () {
        function RefCountOperator(connectable) {
            this.connectable = connectable;
        }
        RefCountOperator.prototype.call = function (subscriber, source) {
            var connectable = this.connectable;
            connectable._refCount++;
            var refCounter = new RefCountSubscriber(subscriber, connectable);
            var subscription = source.subscribe(refCounter);
            if (!refCounter.closed) {
                refCounter.connection = connectable.connect();
            }
            return subscription;
        };
        return RefCountOperator;
    }());
    var RefCountSubscriber = (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount = connectable._refCount;
            if (refCount <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount - 1;
            if (refCount > 1) {
                this.connection = null;
                return;
            }
            ///
            // Compare the local RefCountSubscriber's connection Subscription to the
            // connection Subscription on the shared ConnectableObservable. In cases
            // where the ConnectableObservable source synchronously emits values, and
            // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
            // execution continues to here before the RefCountOperator has a chance to
            // supply the RefCountSubscriber with the shared connection Subscription.
            // For example:
            // ```
            // Observable.range(0, 10)
            //   .publish()
            //   .refCount()
            //   .take(5)
            //   .subscribe();
            // ```
            // In order to account for this case, RefCountSubscriber should only dispose
            // the ConnectableObservable's shared connection Subscription if the
            // connection Subscription exists, *and* either:
            //   a. RefCountSubscriber doesn't have a reference to the shared connection
            //      Subscription yet, or,
            //   b. RefCountSubscriber's connection Subscription reference is identical
            //      to the shared connection Subscription
            ///
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber_1.Subscriber));
});
//# sourceMappingURL=refCount.js.map