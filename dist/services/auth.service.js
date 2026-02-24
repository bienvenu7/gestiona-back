"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("../middlewares/error.middleware");
const company_schema_1 = require("../schema/company.schema");
const auth_controller_1 = require("../controllers/auth.controller");
const authentication_1 = require("../middlewares/authentication");
const router = express_1.default.Router();
router.post('/login', (0, error_middleware_1.validateRequest)({ body: company_schema_1.loginUserSchema }), auth_controller_1.loginUser);
router.get('/get-access', auth_controller_1.refrehToken);
router.get('/me', authentication_1.isAuhenticated, auth_controller_1.getUser);
router.delete('/logout', authentication_1.isAuhenticated, auth_controller_1.logoutUser);
exports.default = router;
//# sourceMappingURL=auth.service.js.map