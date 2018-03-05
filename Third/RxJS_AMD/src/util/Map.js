define(["require", "exports", "./root", "./MapPolyfill"], function (require, exports, root_1, MapPolyfill_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Map = root_1.root.Map || (function () { return MapPolyfill_1.MapPolyfill; })();
});
//# sourceMappingURL=Map.js.map