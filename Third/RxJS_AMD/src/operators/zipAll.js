define(["require", "exports", "./zip"], function (require, exports, zip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zipAll(project) {
        return function (source) { return source.lift(new zip_1.ZipOperator(project)); };
    }
    exports.zipAll = zipAll;
});
//# sourceMappingURL=zipAll.js.map