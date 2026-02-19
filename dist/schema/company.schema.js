"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyWithRelationsSchema = exports.OrderWithRelationsSchema = exports.UpdateOrderSchema = exports.CreateOrderSchema = exports.OrderSchema = exports.UpdateCreditSchema = exports.CreateCreditSchema = exports.CreditSchema = exports.CreatePaymentSchema = exports.PaymentSchema = exports.CreateCartSchema = exports.CartSchema = exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSchema = exports.UpdateUserPasswordSchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.UserSchema = exports.HashSchema = exports.UpdateCompanySchema = exports.CreateCompanySchema = exports.CompanySchema = exports.CreditStatusSchema = exports.PaymentTypeSchema = exports.RoleSchema = void 0;
const zod_1 = require("zod");
// Enums
exports.RoleSchema = zod_1.z.enum(['OWNER', 'ADMIN', 'MANAGER', 'STAFF']);
exports.PaymentTypeSchema = zod_1.z.enum(['CASH', 'CREDIT']);
exports.CreditStatusSchema = zod_1.z.enum(['PENDING', 'PAID', 'OVERDUE']);
// Company Schema
exports.CompanySchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z
        .string('Le nom est obligatoire!')
        .min(4, 'Le nom de la companie est obligatoire!'),
    email: zod_1.z.email('Une adresse email est obligatoire!'),
    password: zod_1.z
        .string()
        .min(6, 'Le mot de passe doit contenir minimun 6 caractères!')
        .max(8, 'Le mot de passe doit contenir maximun 8 caractères!'),
    createdAt: zod_1.z.date(),
});
exports.CreateCompanySchema = exports.CompanySchema.omit({
    id: true,
    createdAt: true,
});
exports.UpdateCompanySchema = exports.CreateCompanySchema.partial();
//Hash Schema
exports.HashSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(6, 'Le code de vérificaton doit contenir 6 caractères')
        .max(6, 'Le code de vérificaton doit contenir 6 caractères')
        .trim(),
    email: zod_1.z.email('Une adresse email est obligatoire!'),
});
// User Schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    companyId: zod_1.z.uuid(),
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: exports.RoleSchema,
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateUserSchema = exports.UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateUserSchema = exports.CreateUserSchema.omit({
    password: true,
}).partial();
exports.UpdateUserPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
// Product Schema
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    companyId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1, 'Product name is required'),
    sku: zod_1.z.string().min(1, 'SKU is required'),
    price: zod_1.z.number().positive('Price must be positive'),
    stockQuantity: zod_1.z
        .number()
        .int()
        .nonnegative('Stock quantity must be non-negative'),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateProductSchema = exports.ProductSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateProductSchema = exports.CreateProductSchema.omit({
    companyId: true,
}).partial();
// Cart Schema
exports.CartSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    orderId: zod_1.z.string().uuid(),
    productName: zod_1.z.string().min(1, 'Product name is required'),
    quantity: zod_1.z.string().min(1, 'Quantity is required'),
    totalPrice: zod_1.z.number().positive('Total price must be positive'),
    createdAt: zod_1.z.date(),
});
exports.CreateCartSchema = exports.CartSchema.omit({
    id: true,
    createdAt: true,
});
// Payment Schema
exports.PaymentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    orderId: zod_1.z.string().uuid(),
    amountPaid: zod_1.z.number().positive('Amount paid must be positive'),
    paymentDate: zod_1.z.date(),
});
exports.CreatePaymentSchema = exports.PaymentSchema.omit({
    id: true,
    paymentDate: true,
});
// Credit Schema
exports.CreditSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    orderId: zod_1.z.string().uuid(),
    totalAmount: zod_1.z.number().positive('Total amount must be positive'),
    paidAmount: zod_1.z.number().nonnegative('Paid amount must be non-negative'),
    remainingAmount: zod_1.z
        .number()
        .nonnegative('Remaining amount must be non-negative'),
    dueDate: zod_1.z.date(),
    status: exports.CreditStatusSchema,
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateCreditSchema = exports.CreditSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.UpdateCreditSchema = exports.CreateCreditSchema.omit({
    orderId: true,
}).partial();
// Order Schema
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    companyId: zod_1.z.string().uuid(),
    clientName: zod_1.z.string().min(1, 'Client name is required'),
    clientEmail: zod_1.z.string().email('Invalid email address'),
    totalAmount: zod_1.z.number().positive('Total amount must be positive'),
    paymentType: exports.PaymentTypeSchema,
    createdAt: zod_1.z.date(),
});
exports.CreateOrderSchema = exports.OrderSchema.omit({
    id: true,
    createdAt: true,
});
exports.UpdateOrderSchema = exports.CreateOrderSchema.omit({
    companyId: true,
}).partial();
// Extended schemas with relations (for API responses)
exports.OrderWithRelationsSchema = exports.OrderSchema.extend({
    products: zod_1.z.array(exports.CartSchema),
    payments: zod_1.z.array(exports.PaymentSchema),
    credit: exports.CreditSchema.nullable(),
});
exports.CompanyWithRelationsSchema = exports.CompanySchema.extend({
    users: zod_1.z.array(exports.UserSchema.omit({ password: true })),
    products: zod_1.z.array(exports.ProductSchema),
    orders: zod_1.z.array(exports.OrderSchema),
});
//# sourceMappingURL=company.schema.js.map