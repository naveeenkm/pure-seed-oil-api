const multer = require("multer");

const MAX_SIZE_BYTES = (parseInt(process.env.MAX_IMAGE_SIZE_MB) || 5) * 1024 * 1024;
const ALLOWED_TYPES = (process.env.ALLOWED_IMAGE_TYPES || "image/jpeg,image/png,image/webp").split(",");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

module.exports = { upload };
