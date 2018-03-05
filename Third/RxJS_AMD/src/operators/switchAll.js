define(["require", "exports", "./switchMap", "../util/identity"], function (require, exports, switchMap_1, identity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function switchAll() {
        return switchMap_1.switchMap(identity_1.identity);
    }
    exports.switchAll = switchAll;
});
//# sourceMappingURL=switchAll.js.map