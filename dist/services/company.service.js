"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const company_schema_1 = require("../schema/company.schema");
const authentication_1 = require("../middlewares/authentication");
const router = express_1.default.Router();
router.post('/register', (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreateCompanySchema }), company_controller_1.registerCP);
router.post('/create-user', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreateUserFromOwner }), company_controller_1.createUser);
router.get('/users', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), company_controller_1.getUsers);
router.delete('/delete-user', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), company_controller_1.deleteUser);
router.patch('/update-user', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema, body: company_schema_1.UpdateUserSchema }), company_controller_1.updateUserStatus);
router.patch('/verify-otp', (0, error_middleware_1.validateRequest)({ body: company_schema_1.HashSchema }), company_controller_1.verifyHash);
exports.default = router;
//# sourceMappingURL=company.service.js.map