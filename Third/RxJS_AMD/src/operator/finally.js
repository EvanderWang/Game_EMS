define(["require", "exports", "../operators/finalize"], function (require, exports, finalize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Returns an Observable that mirrors the source Observable, but will call a specified function when
     * the source terminates on complete or error.
     * @param {function} callback Function to be called when source terminates.
     * @return {Observable} An Observable that mirrors the source, but will call the specified function on termination.
     * @method finally
     * @owner Observable
     */
    function _finally(callback) {
        return finalize_1.finalize(callback)(this);
    }
    exports._finally = _finally;
});
//# sourceMappingURL=finally.js.map