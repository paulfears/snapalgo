"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = void 0;
const rfdc_1 = __importDefault(require("rfdc"));
exports.deepClone = (0, rfdc_1.default)({ proto: false, circles: false });
//# sourceMappingURL=deep-clone.js.map