"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const company_service_1 = __importDefault(require("../services/company.service"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const product_service_1 = __importDefault(require("../services/product.service"));
const client_service_1 = __importDefault(require("../services/client.service"));
const order_service_1 = __importDefault(require("../services/order.service"));
// Configure all routes
const configureRoutes = (app) => {
    // API routes and services
    app.use('/v1/company', company_service_1.default);
    app.use('/v1/auth', auth_service_1.default);
    app.use('/v1/product', product_service_1.default);
    app.use('/v1/client', client_service_1.default);
    app.use('/v1/order', order_service_1.default);
};
exports.configureRoutes = configureRoutes;
//# sourceMappingURL=routes.js.map