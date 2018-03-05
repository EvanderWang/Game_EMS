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
define(["require", "exports", "../Subject", "../Subscription", "./SubscriptionLoggable", "../util/applyMixins"], function (require, exports, Subject_1, Subscription_1, SubscriptionLoggable_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    var HotObservable = (function (_super) {
        __extends(HotObservable, _super);
        function HotObservable(messages, scheduler) {
            var _this = _super.call(this) || this;
            _this.messages = messages;
            _this.subscriptions = [];
            _this.scheduler = scheduler;
            return _this;
        }
        HotObservable.prototype._subscribe = function (subscriber) {
            var subject = this;
            var index = subject.logSubscribedFrame();
            subscriber.add(new Subscription_1.Subscription(function () {
                subject.logUnsubscribedFrame(index);
            }));
            return _super.prototype._subscribe.call(this, subscriber);
        };
        HotObservable.prototype.setup = function () {
            var subject = this;
            var messagesLength = subject.messages.length;
            /* tslint:disable:no-var-keyword */
            for (var i = 0; i < messagesLength; i++) {
                (function () {
                    var message = subject.messages[i];
                    /* tslint:enable */
                    subject.scheduler.schedule(function () { message.notification.observe(subject); }, message.frame);
                })();
            }
        };
        return HotObservable;
    }(Subject_1.Subject));
    exports.HotObservable = HotObservable;
    applyMixins_1.applyMixins(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
});
//# sourceMappingURL=HotObservable.js.map