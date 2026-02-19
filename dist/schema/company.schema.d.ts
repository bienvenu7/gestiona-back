import { z } from 'zod';
export declare const RoleSchema: z.ZodEnum<{
    OWNER: "OWNER";
    ADMIN: "ADMIN";
    MANAGER: "MANAGER";
    STAFF: "STAFF";
}>;
export declare const PaymentTypeSchema: z.ZodEnum<{
    CASH: "CASH";
    CREDIT: "CREDIT";
}>;
export declare const CreditStatusSchema: z.ZodEnum<{
    PENDING: "PENDING";
    PAID: "PAID";
    OVERDUE: "OVERDUE";
}>;
export declare const CompanySchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const CreateCompanySchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const UpdateCompanySchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodEmail>;
    name: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const HashSchema: z.ZodObject<{
    code: z.ZodString;
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodUUID;
    companyId: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        STAFF: "STAFF";
    }>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodEmail;
    name: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        STAFF: "STAFF";
    }>;
    companyId: z.ZodUUID;
}, z.core.$strip>;
export declare const UpdateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodEmail>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        OWNER: "OWNER";
        ADMIN: "ADMIN";
        MANAGER: "MANAGER";
        STAFF: "STAFF";
    }>>;
    companyId: z.ZodOptional<z.ZodUUID>;
}, z.core.$strip>;
export declare const UpdateUserPasswordSchema: z.ZodObject<{
    password: z.ZodString;
}, z.core.$strip>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    companyId: z.ZodString;
    name: z.ZodString;
    sku: z.ZodString;
    price: z.ZodNumber;
    stockQuantity: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const CreateProductSchema: z.ZodObject<{
    name: z.ZodString;
    companyId: z.ZodString;
    sku: z.ZodString;
    price: z.ZodNumber;
    stockQuantity: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    stockQuantity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CartSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    productName: z.ZodString;
    quantity: z.ZodString;
    totalPrice: z.ZodNumber;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const CreateCartSchema: z.ZodObject<{
    orderId: z.ZodString;
    productName: z.ZodString;
    quantity: z.ZodString;
    totalPrice: z.ZodNumber;
}, z.core.$strip>;
export declare const PaymentSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    amountPaid: z.ZodNumber;
    paymentDate: z.ZodDate;
}, z.core.$strip>;
export declare const CreatePaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    amountPaid: z.ZodNumber;
}, z.core.$strip>;
export declare const CreditSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    totalAmount: z.ZodNumber;
    paidAmount: z.ZodNumber;
    remainingAmount: z.ZodNumber;
    dueDate: z.ZodDate;
    status: z.ZodEnum<{
        PENDING: "PENDING";
        PAID: "PAID";
        OVERDUE: "OVERDUE";
    }>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const CreateCreditSchema: z.ZodObject<{
    orderId: z.ZodString;
    status: z.ZodEnum<{
        PENDING: "PENDING";
        PAID: "PAID";
        OVERDUE: "OVERDUE";
    }>;
    totalAmount: z.ZodNumber;
    paidAmount: z.ZodNumber;
    remainingAmount: z.ZodNumber;
    dueDate: z.ZodDate;
}, z.core.$strip>;
export declare const UpdateCreditSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        PAID: "PAID";
        OVERDUE: "OVERDUE";
    }>>;
    totalAmount: z.ZodOptional<z.ZodNumber>;
    paidAmount: z.ZodOptional<z.ZodNumber>;
    remainingAmount: z.ZodOptional<z.ZodNumber>;
    dueDate: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    companyId: z.ZodString;
    clientName: z.ZodString;
    clientEmail: z.ZodString;
    totalAmount: z.ZodNumber;
    paymentType: z.ZodEnum<{
        CASH: "CASH";
        CREDIT: "CREDIT";
    }>;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const CreateOrderSchema: z.ZodObject<{
    companyId: z.ZodString;
    totalAmount: z.ZodNumber;
    paymentType: z.ZodEnum<{
        CASH: "CASH";
        CREDIT: "CREDIT";
    }>;
    clientName: z.ZodString;
    clientEmail: z.ZodString;
}, z.core.$strip>;
export declare const UpdateOrderSchema: z.ZodObject<{
    totalAmount: z.ZodOptional<z.ZodNumber>;
    paymentType: z.ZodOptional<z.ZodEnum<{
        CASH: "CASH";
        CREDIT: "CREDIT";
    }>>;
    clientName: z.ZodOptional<z.ZodString>;
    clientEmail: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const OrderWithRelationsSchema: z.ZodObject<{
    id: z.ZodString;
    companyId: z.ZodString;
    clientName: z.ZodString;
    clientEmail: z.ZodString;
    totalAmount: z.ZodNumber;
    paymentType: z.ZodEnum<{
        CASH: "CASH";
        CREDIT: "CREDIT";
    }>;
    createdAt: z.ZodDate;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orderId: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodString;
        totalPrice: z.ZodNumber;
        createdAt: z.ZodDate;
    }, z.core.$strip>>;
    payments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orderId: z.ZodString;
        amountPaid: z.ZodNumber;
        paymentDate: z.ZodDate;
    }, z.core.$strip>>;
    credit: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        orderId: z.ZodString;
        totalAmount: z.ZodNumber;
        paidAmount: z.ZodNumber;
        remainingAmount: z.ZodNumber;
        dueDate: z.ZodDate;
        status: z.ZodEnum<{
            PENDING: "PENDING";
            PAID: "PAID";
            OVERDUE: "OVERDUE";
        }>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const CompanyWithRelationsSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    createdAt: z.ZodDate;
    users: z.ZodArray<z.ZodObject<{
        email: z.ZodEmail;
        id: z.ZodUUID;
        name: z.ZodString;
        createdAt: z.ZodDate;
        role: z.ZodEnum<{
            OWNER: "OWNER";
            ADMIN: "ADMIN";
            MANAGER: "MANAGER";
            STAFF: "STAFF";
        }>;
        companyId: z.ZodUUID;
        updatedAt: z.ZodDate;
    }, z.core.$strip>>;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        companyId: z.ZodString;
        name: z.ZodString;
        sku: z.ZodString;
        price: z.ZodNumber;
        stockQuantity: z.ZodNumber;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, z.core.$strip>>;
    orders: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        companyId: z.ZodString;
        clientName: z.ZodString;
        clientEmail: z.ZodString;
        totalAmount: z.ZodNumber;
        paymentType: z.ZodEnum<{
            CASH: "CASH";
            CREDIT: "CREDIT";
        }>;
        createdAt: z.ZodDate;
    }, z.core.$strip>>;
}, z.core.$strip>;
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
//# sourceMappingURL=company.schema.d.ts.map