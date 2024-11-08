"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padNumber = exports.padString = exports.upperCaseFirstChar = void 0;
/**
 * Upper-cases the first letter of a string.
 */
const upperCaseFirstChar = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.upperCaseFirstChar = upperCaseFirstChar;
/**
 * Pads a string to a certain length with spaces.
 */
const padString = (str, length) => {
    return str + ' '.repeat(length - str.length);
};
exports.padString = padString;
/**
 * Pads a number to a certain length with zeros.
 */
const padNumber = (number, length) => {
    const str = String(number);
    return '0'.repeat(length - str.length) + str;
};
exports.padNumber = padNumber;
//# sourceMappingURL=strings.js.map