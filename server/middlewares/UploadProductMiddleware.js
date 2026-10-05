const multer = require("multer")

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"]

  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only images allowed"), false)
  }
}

const uploadProdMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, 
    files: 5 
  }
})

module.exports = uploadProdMiddleware