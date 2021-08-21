"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    INVALID_TYPE: (expected, got, name) => {
        var _a;
        return `Expected ${Array.isArray(expected)
            ? expected
                .map((e) => (typeof e === "number" ? e : `'${e}'`))
                .join(" or ")
            : `'${expected}'`}${name ? ` for ${name}` : ""}, but got ${typeof got === "string"
            ? `'${got}'`
            : typeof got === "number"
                ? got
                : Array.isArray(got)
                    ? `Array<${got.length}>`
                    : ((_a = got === null || got === void 0 ? void 0 : got.constructor) === null || _a === void 0 ? void 0 : _a.name) || typeof got}`;
    },
    UNDEFINED_VALUE: (expected, got, name) => `Expected '${expected}' for '${name}', but got '${got}'`,
};
//# sourceMappingURL=constants.js.map