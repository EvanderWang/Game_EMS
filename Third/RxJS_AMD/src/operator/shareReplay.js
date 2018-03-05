define(["require", "exports", "../operators/shareReplay"], function (require, exports, shareReplay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @method shareReplay
     * @owner Observable
     */
    function shareReplay(bufferSize, windowTime, scheduler) {
        return shareReplay_1.shareReplay(bufferSize, windowTime, scheduler)(this);
    }
    exports.shareReplay = shareReplay;
    ;
});
//# sourceMappingURL=shareReplay.js.map