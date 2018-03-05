define(["require", "exports", "./multicast", "./refCount", "../Subject"], function (require, exports, multicast_1, refCount_1, Subject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function shareSubjectFactory() {
        return new Subject_1.Subject();
    }
    /**
     * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
     * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
     * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
     * This is an alias for .multicast(() => new Subject()).refCount().
     *
     * <img src="./img/share.png" width="100%">
     *
     * @return {Observable<T>} An Observable that upon connection causes the source Observable to emit items to its Observers.
     * @method share
     * @owner Observable
     */
    function share() {
        return function (source) { return refCount_1.refCount()(multicast_1.multicast(shareSubjectFactory)(source)); };
    }
    exports.share = share;
    ;
});
//# sourceMappingURL=share.js.map