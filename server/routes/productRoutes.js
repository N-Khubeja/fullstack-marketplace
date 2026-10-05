const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getOneProduct,
  createProduct,
  getMyProducts
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/authMiddleware")
const uploadProdMiddleware = require("../middlewares/UploadProductMiddleware")
const parseProductAttributes = require("../middlewares/ProductAttributes")

const {handleValidationErrors,UploadProduct} = require("../middlewares/validation")

router.get("/", getAllProducts);
router.post("/",authMiddleware,uploadProdMiddleware.array("images", 5),parseProductAttributes,UploadProduct,handleValidationErrors, createProduct);
router.get("/products/my",authMiddleware,getMyProducts)
router.get("/:slug",getOneProduct)

module.exports = router;