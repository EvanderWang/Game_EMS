define(["require", "exports", "../AsyncSubject", "./multicast"], function (require, exports, AsyncSubject_1, multicast_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function publishLast() {
        return function (source) { return multicast_1.multicast(new AsyncSubject_1.AsyncSubject())(source); };
    }
    exports.publishLast = publishLast;
});
//# sourceMappingURL=publishLast.js.map