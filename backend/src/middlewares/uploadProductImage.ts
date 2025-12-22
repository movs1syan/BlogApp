import multer from 'multer';
import path from 'path';

const uploadPath = path.join(process.cwd(), 'uploads', 'products');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadProductImage = multer({ storage });