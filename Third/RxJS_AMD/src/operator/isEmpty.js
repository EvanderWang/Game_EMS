define(["require", "exports", "../operators/isEmpty"], function (require, exports, isEmpty_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
     *
     * <img src="./img/isEmpty.png" width="100%">
     *
     * @return {Observable} An Observable that emits a Boolean.
     * @method isEmpty
     * @owner Observable
     */
    function isEmpty() {
        return isEmpty_1.isEmpty()(this);
    }
    exports.isEmpty = isEmpty;
});
//# sourceMappingURL=isEmpty.js.map