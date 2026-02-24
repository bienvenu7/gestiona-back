"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorRow = exports.upload = void 0;
exports.generateSKU = generateSKU;
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
        }
        else {
            cb(new Error('Only Excel files allowed'));
        }
    },
});
const validatorRow = (row) => {
    if (!row.nom || row.nom.trim() === '') {
        return 'Le nom est obligatoire';
    }
    if (!row.prix || isNaN(Number(row.prix))) {
        return 'Le prix est obilgatoire';
    }
    if (!row.stock || row.stock === 0 || isNaN(Number(row.stock))) {
        return 'Le stock est obilgatoire';
    }
    return null;
};
exports.validatorRow = validatorRow;
function generateSKU(name) {
    const prefix = name
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 3)
        .toUpperCase();
    const randomPart = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    // 6 caractères hex
    const timePart = Date.now().toString(36).toUpperCase();
    return `${prefix}-${randomPart}-${timePart}`;
}
//# sourceMappingURL=multer.config.js.map