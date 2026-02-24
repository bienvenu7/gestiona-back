"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("../middlewares/error.middleware");
const authentication_1 = require("../middlewares/authentication");
const company_schema_1 = require("../schema/company.schema");
const product_controller_1 = require("../controllers/product.controller");
const multer_config_1 = require("../config/multer.config");
const router = express_1.default.Router();
router.post('/create-products', authentication_1.isAuhenticated, multer_config_1.upload.single('file'), (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), product_controller_1.createManyProductfromXml);
router.post('/create-one', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ body: company_schema_1.CreateProductSchema }), product_controller_1.createOneProduct);
router.get('/get-products', authentication_1.isAuhenticated, (0, error_middleware_1.validateRequest)({ query: company_schema_1.QuerySchema }), product_controller_1.getProducts);
exports.default = router;
//# sourceMappingURL=product.service.js.map