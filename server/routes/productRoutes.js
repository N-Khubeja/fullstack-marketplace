const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getOneProduct,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getFavoriteProducts,
  toggleFavProduct
  
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/authMiddleware")
const uploadProdMiddleware = require("../middlewares/UploadProductMiddleware")
const parseProductAttributes = require("../middlewares/ProductAttributes")

const {handleValidationErrors,UploadProduct,UpdateProductVal} = require("../middlewares/validation")

router.get("/", getAllProducts);
router.post("/create",authMiddleware,uploadProdMiddleware.array("images", 5),parseProductAttributes,UploadProduct,handleValidationErrors, createProduct);
router.get("/my",authMiddleware,getMyProducts)
router.patch("/update/:slug",authMiddleware,uploadProdMiddleware.array("images", 5),parseProductAttributes,UpdateProductVal,handleValidationErrors,updateProduct)

router.delete("/delete/:slug",authMiddleware,deleteProduct)
router.get("/get-favorites",authMiddleware,getFavoriteProducts)
router.post("/toggle-favorite-prod",authMiddleware,toggleFavProduct)

router.get("/:slug",getOneProduct)

module.exports = router;