import multer from 'multer';
export declare const upload: multer.Multer;
export declare const validatorRow: (row: ProductExcelRow) => "Le nom est obligatoire" | "Le prix est obilgatoire" | "Le stock est obilgatoire" | null;
export declare function generateSKU(name: string): string;
//# sourceMappingURL=multer.config.d.ts.map