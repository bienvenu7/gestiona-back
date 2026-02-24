"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.createOneProduct = exports.createManyProductfromXml = void 0;
const app_error_1 = require("../utils/app.error");
const XLSX = __importStar(require("xlsx"));
const server_1 = require("../server");
const db_config_1 = require("../config/db.config");
const company_schema_1 = require("../schema/company.schema");
const multer_config_1 = require("../config/multer.config");
const createManyProductfromXml = async (req, res, next) => {
    const file = req.file;
    const { id: companyId } = company_schema_1.QuerySchema.parse(req.query);
    if (!file) {
        return next(new app_error_1.AppError("Aucun ficher n'a été soumis", 400));
    }
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: 0 });
    const batchSize = 50, validRows = [], failedRows = [];
    let processed = 0;
    let responseProducts = [];
    data.forEach((row, index) => {
        const error = (0, multer_config_1.validatorRow)(row);
        if (error) {
            failedRows.push({
                row: index + 2, // +2 car Excel commence à 1 + header
                error,
                data: row,
            });
        }
        else {
            validRows.push({
                nom: row.nom.trim(),
                prix: Number(row.prix),
                stock: row.stock,
            });
        }
    });
    const total = validRows.length;
    for (let i = 0; i < validRows.length; i += batchSize) {
        const batch = validRows.slice(i, i + batchSize).map(row => ({
            companyId,
            name: row['nom'],
            price: row['prix'],
            stockQuantity: row['stock'],
            sku: (0, multer_config_1.generateSKU)(row['nom']),
        }));
        await db_config_1.prisma.product.createMany({
            data: batch,
            skipDuplicates: true,
        });
        processed += batch.length;
        server_1.io.emit('uploadProgress', {
            processed,
            total,
            failed: failedRows.length,
            percentage: Math.round((processed / total) * 100),
        });
        responseProducts = [...responseProducts, ...batch];
    }
    server_1.io.to(`${companyId}`).emit('productsCreated', responseProducts);
    return res.status(201).json({
        message: 'Importation des produits reussies',
        totalRows: data.length,
        inserted: validRows.length,
        failed: failedRows.length,
        errors: failedRows,
        products: responseProducts,
    });
};
exports.createManyProductfromXml = createManyProductfromXml;
const createOneProduct = async (req, res, next) => {
    const product = company_schema_1.CreateProductSchema.parse(req.body);
    const createP = await db_config_1.prisma.product.create({
        data: { ...product, sku: (0, multer_config_1.generateSKU)(product.name) },
    });
    if (!createP) {
        return next(new app_error_1.AppError('Impossible de créer un produit', 405));
    }
    server_1.io.to(`${product.companyId}`).emit('newProduct', createP);
    return res.status(201).json(createP);
};
exports.createOneProduct = createOneProduct;
const getProducts = async (req, res) => {
    const { id } = company_schema_1.QuerySchema.parse(req.query);
    const products = await db_config_1.prisma.product.findMany({
        where: {
            companyId: id,
        },
        select: {
            companyId: true,
            price: true,
            name: true,
            sku: true,
            stockQuantity: true,
            id: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return res.status(200).json({ data: products });
};
exports.getProducts = getProducts;
//# sourceMappingURL=product.controller.js.map