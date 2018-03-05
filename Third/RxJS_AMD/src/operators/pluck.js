define(["require", "exports", "./map"], function (require, exports, map_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Maps each source value (an object) to its specified nested property.
     *
     * <span class="informal">Like {@link map}, but meant only for picking one of
     * the nested properties of every emitted object.</span>
     *
     * <img src="./img/pluck.png" width="100%">
     *
     * Given a list of strings describing a path to an object property, retrieves
     * the value of a specified nested property from all values in the source
     * Observable. If a property can't be resolved, it will return `undefined` for
     * that value.
     *
     * @example <caption>Map every click to the tagName of the clicked target element</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var tagNames = clicks.pluck('target', 'tagName');
     * tagNames.subscribe(x => console.log(x));
     *
     * @see {@link map}
     *
     * @param {...string} properties The nested properties to pluck from each source
     * value (an object).
     * @return {Observable} A new Observable of property values from the source values.
     * @method pluck
     * @owner Observable
     */
    function pluck() {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        var length = properties.length;
        if (length === 0) {
            throw new Error('list of properties cannot be empty.');
        }
        return function (source) { return map_1.map(plucker(properties, length))(source); };
    }
    exports.pluck = pluck;
    function plucker(props, length) {
        var mapper = function (x) {
            var currentProp = x;
            for (var i = 0; i < length; i++) {
                var p = currentProp[props[i]];
                if (typeof p !== 'undefined') {
                    currentProp = p;
                }
                else {
                    return undefined;
                }
            }
            return currentProp;
        };
        return mapper;
    }
});
//# sourceMappingURL=pluck.js.map