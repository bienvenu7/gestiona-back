import multer from 'multer';
import crypto from 'crypto';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files allowed'));
    }
  },
});

export const validatorRow = (row: ProductExcelRow) => {
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

export function generateSKU(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 3)
    .toUpperCase();

  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  // 6 caractères hex

  const timePart = Date.now().toString(36).toUpperCase();

  return `${prefix}-${randomPart}-${timePart}`;
}
