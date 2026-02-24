"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = exports.expiredAtFunc = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const expiredAtFunc = (time) => new Date(Date.now() + time);
exports.expiredAtFunc = expiredAtFunc;
const createToken = (userData, secret, duration) => {
    return (0, jsonwebtoken_1.sign)(userData, secret, {
        expiresIn: duration,
    });
};
exports.createToken = createToken;
const verifyToken = (token, secret) => {
    const decoded = (0, jsonwebtoken_1.verify)(token, secret);
    return decoded;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.config.js.map