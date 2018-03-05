define(["require", "exports", "../util/root"], function (require, exports, root_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getSymbolObservable(context) {
        var $$observable;
        var Symbol = context.Symbol;
        if (typeof Symbol === 'function') {
            if (Symbol.observable) {
                $$observable = Symbol.observable;
            }
            else {
                $$observable = Symbol('observable');
                Symbol.observable = $$observable;
            }
        }
        else {
            $$observable = '@@observable';
        }
        return $$observable;
    }
    exports.getSymbolObservable = getSymbolObservable;
    exports.observable = getSymbolObservable(root_1.root);
    /**
     * @deprecated use observable instead
     */
    exports.$$observable = exports.observable;
});
//# sourceMappingURL=observable.js.map