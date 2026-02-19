"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("../controllers/company.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
const company_schema_1 = require("../schema/company.schema");
const router = express_1.default.Router();
router.post('/register', (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreateCompanySchema }), company_controller_1.registerCP);
router.patch('/verify-otp', (0, error_middleware_1.validateRequest)({ body: company_schema_1.HashSchema }), company_controller_1.verifyHash);
exports.default = router;
//# sourceMappingURL=company.service.js.map