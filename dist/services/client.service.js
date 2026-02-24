"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("../middlewares/error.middleware");
const authentication_1 = require("../middlewares/authentication");
const company_schema_1 = require("../schema/company.schema");
const client_controller_1 = require("../controllers/client.controller");
const router = express_1.default.Router();
router.post('/create-client', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreateClientSchema, query: company_schema_1.QuerySchema }), client_controller_1.createNewClient);
router.get('/clients', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), client_controller_1.getClients);
exports.default = router;
//# sourceMappingURL=client.service.js.map