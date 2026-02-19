import { z } from 'zod';

// Enums
export const RoleSchema = z.enum(['OWNER', 'ADMIN', 'MANAGER', 'STAFF']);

export const PaymentTypeSchema = z.enum(['CASH', 'CREDIT']);

export const CreditStatusSchema = z.enum(['PENDING', 'PAID', 'OVERDUE']);

//Query Schema
export const QuerySchema = z.object({
  id: z.uuid().trim(),
});

// User Schema
export const UserSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 8 characters'),
  role: RoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateUserFromOwner = CreateUserSchema.omit({
  password: true,
});

export const CreateUserForCompanySchema = CreateUserSchema.omit({
  companyId: true,
  role: true,
});

export const loginUserSchema = CreateUserForCompanySchema.omit({
  name: true,
});

export const UpdateUserSchema = CreateUserSchema.omit({
  password: true,
  companyId: true,
}).partial();

export const UpdateUserPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Company Schema
export const CompanySchema = z.object({
  id: z.uuid(),
  name: z
    .string('Le nom est obligatoire!')
    .min(4, 'Le nom de la companie est obligatoire!'),
  createdAt: z.date(),
});

export const CreateCompanySchema = CompanySchema.extend({
  user: CreateUserForCompanySchema,
}).omit({
  id: true,
  createdAt: true,
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

//Hash Schema
export const HashSchema = z.object({
  code: z
    .string()
    .min(6, 'Le code de vérificaton doit contenir 6 caractères')
    .max(6, 'Le code de vérificaton doit contenir 6 caractères')
    .trim(),
  email: z.email('Une adresse email est obligatoire!'),
});

// Product Schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().positive('Price must be positive'),
  stockQuantity: z
    .number()
    .int()
    .nonnegative('Stock quantity must be non-negative'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sku: true,
});

export const CreateProductsByXml = CreateProductSchema.pick({
  companyId: true,
});

export const UpdateProductSchema = CreateProductSchema.omit({
  companyId: true,
}).partial();

// Cart Schema
export const CartSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  totalPrice: z.number().positive('Total price must be positive'),
  createdAt: z.date(),
});

export const CreateCartSchema = CartSchema.omit({
  id: true,
  createdAt: true,
});

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  amountPaid: z.number().positive('Amount paid must be positive'),
  paymentDate: z.date(),
});

export const CreatePaymentSchema = PaymentSchema.omit({
  id: true,
  paymentDate: true,
});

// Credit Schema
export const CreditSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  totalAmount: z.number().positive('Total amount must be positive'),
  paidAmount: z.number().nonnegative('Paid amount must be non-negative'),
  remainingAmount: z
    .number()
    .nonnegative('Remaining amount must be non-negative'),
  dueDate: z.date(),
  status: CreditStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCreditSchema = CreditSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCreditSchema = CreateCreditSchema.omit({
  orderId: true,
}).partial();

// Order Schema
export const OrderSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  totalAmount: z.number().positive('Total amount must be positive'),
  paymentType: PaymentTypeSchema,
  createdAt: z.date(),
});

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateOrderSchema = CreateOrderSchema.omit({
  companyId: true,
}).partial();

// Extended schemas with relations (for API responses)
export const OrderWithRelationsSchema = OrderSchema.extend({
  products: z.array(CartSchema),
  payments: z.array(PaymentSchema),
  credit: CreditSchema.nullable(),
});

export const CompanyWithRelationsSchema = CompanySchema.extend({
  users: z.array(UserSchema.omit({ password: true })),
  products: z.array(ProductSchema),
  orders: z.array(OrderSchema),
});

// Type exports
export type Role = z.infer<typeof RoleSchema>;
export type PaymentType = z.infer<typeof PaymentTypeSchema>;
export type CreditStatus = z.infer<typeof CreditStatusSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type CreateCompany = z.infer<typeof CreateCompanySchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type CreateCart = z.infer<typeof CreateCartSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type Credit = z.infer<typeof CreditSchema>;
export type CreateCredit = z.infer<typeof CreateCreditSchema>;
export type UpdateCredit = z.infer<typeof UpdateCreditSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
export type OrderWithRelations = z.infer<typeof OrderWithRelationsSchema>;
export type CompanyWithRelations = z.infer<typeof CompanyWithRelationsSchema>;
