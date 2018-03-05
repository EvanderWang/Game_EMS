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
    /**
     * Returns an Observable that skips the first `count` items emitted by the source Observable.
     *
     * <img src="./img/skip.png" width="100%">
     *
     * @param {Number} count - The number of times, items emitted by source Observable should be skipped.
     * @return {Observable} An Observable that skips values emitted by the source Observable.
     *
     * @method skip
     * @owner Observable
     */
    function skip(count) {
        return function (source) { return source.lift(new SkipOperator(count)); };
    }
    exports.skip = skip;
    var SkipOperator = (function () {
        function SkipOperator(total) {
            this.total = total;
        }
        SkipOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new SkipSubscriber(subscriber, this.total));
        };
        return SkipOperator;
    }());
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var SkipSubscriber = (function (_super) {
        __extends(SkipSubscriber, _super);
        function SkipSubscriber(destination, total) {
            var _this = _super.call(this, destination) || this;
            _this.total = total;
            _this.count = 0;
            return _this;
        }
        SkipSubscriber.prototype._next = function (x) {
            if (++this.count > this.total) {
                this.destination.next(x);
            }
        };
        return SkipSubscriber;
    }(Subscriber_1.Subscriber));
});
//# sourceMappingURL=skip.js.map