"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const error_middleware_1 = require("../middlewares/error.middleware");
const company_schema_1 = require("../schema/company.schema");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post('/create-order', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreateOrderWithCart }), order_controller_1.createOrder);
router.post('/pay-order', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreatePaymentSchema }), order_controller_1.payOrder);
router.get('/orders', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), order_controller_1.getCompanyOrders);
router.get('/payments', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), order_controller_1.getPayment);
router.get('/payments-stats', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), order_controller_1.getPaymentStats);
exports.default = router;
//# sourceMappingURL=order.service.js.map