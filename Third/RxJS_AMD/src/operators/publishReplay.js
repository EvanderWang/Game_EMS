define(["require", "exports", "../ReplaySubject", "./multicast"], function (require, exports, ReplaySubject_1, multicast_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* tslint:enable:max-line-length */
    function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
        if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
            scheduler = selectorOrScheduler;
        }
        var selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
        var subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
        return function (source) { return multicast_1.multicast(function () { return subject; }, selector)(source); };
    }
    exports.publishReplay = publishReplay;
});
//# sourceMappingURL=publishReplay.js.map