import multer from "multer";
import path from "path";
import fs from "fs";

// ============================================================
// TEAM UPLOAD DIRECTORY
// ============================================================

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "team"
);

// Create directory automatically
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ============================================================
// STORAGE
// ============================================================

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);

    const fileName = `${Date.now()}-${baseName}${ext}`;

    cb(null, fileName);
  },
});

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;