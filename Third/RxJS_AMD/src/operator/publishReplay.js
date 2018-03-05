define(["require", "exports", "../operators/publishReplay"], function (require, exports, publishReplay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* tslint:enable:max-line-length */
    /**
     * @param bufferSize
     * @param windowTime
     * @param selectorOrScheduler
     * @param scheduler
     * @return {Observable<T> | ConnectableObservable<T>}
     * @method publishReplay
     * @owner Observable
     */
    function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
        return publishReplay_1.publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler)(this);
    }
    exports.publishReplay = publishReplay;
});
//# sourceMappingURL=publishReplay.js.map