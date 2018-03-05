define(["require", "exports", "../util/root"], function (require, exports, root_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Symbol = root_1.root.Symbol;
    exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
        Symbol.for('rxSubscriber') : '@@rxSubscriber';
    /**
     * @deprecated use rxSubscriber instead
     */
    exports.$$rxSubscriber = exports.rxSubscriber;
});
//# sourceMappingURL=rxSubscriber.js.map