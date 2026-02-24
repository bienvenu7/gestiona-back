"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPassword = void 0;
const generate_password_1 = __importDefault(require("generate-password"));
const genPassword = () => {
    const password = generate_password_1.default.generate({
        length: Math.floor(Math.random() * 7) + 6, // 6-12 chars
        numbers: true,
        uppercase: true,
        lowercase: true,
        strict: true,
    });
    return password;
};
exports.genPassword = genPassword;
//# sourceMappingURL=gen.psd.js.map