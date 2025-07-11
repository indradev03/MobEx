import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Filter files (optional) — accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB file size
});

// Middleware wrapper to handle multer errors gracefully
export const uploadFields = (req, res, next) => {
  const multerMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnails", maxCount: 5 },
  ]);

  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer specific errors
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Unknown errors
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export default upload;
