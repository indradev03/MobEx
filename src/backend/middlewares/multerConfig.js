import multer from "multer";
import path from "path";
import fs from "fs";

// Resolve absolute path to uploads folder
const uploadDir = path.resolve(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created uploads directory at ${uploadDir}`);
}

// Configure storage with unique file names
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

// Filter: accept only images (jpeg, jpg, png, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Multer instance with limits and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

// Middleware wrapper to handle multer upload fields and errors gracefully
export const uploadFields = (req, res, next) => {
  const multerMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnails", maxCount: 5 },
  ]);

  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export default upload;
