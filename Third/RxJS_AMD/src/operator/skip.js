define(["require", "exports", "../operators/skip"], function (require, exports, skip_1) {
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
        return skip_1.skip(count)(this);
    }
    exports.skip = skip;
});
//# sourceMappingURL=skip.js.map