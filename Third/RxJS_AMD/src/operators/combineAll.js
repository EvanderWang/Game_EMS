define(["require", "exports", "../operators/combineLatest"], function (require, exports, combineLatest_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function combineAll(project) {
        return function (source) { return source.lift(new combineLatest_1.CombineLatestOperator(project)); };
    }
    exports.combineAll = combineAll;
});
//# sourceMappingURL=combineAll.js.map