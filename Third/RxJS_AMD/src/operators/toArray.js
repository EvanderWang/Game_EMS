define(["require", "exports", "./reduce"], function (require, exports, reduce_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function toArrayReducer(arr, item, index) {
        arr.push(item);
        return arr;
    }
    function toArray() {
        return reduce_1.reduce(toArrayReducer, []);
    }
    exports.toArray = toArray;
});
//# sourceMappingURL=toArray.js.map