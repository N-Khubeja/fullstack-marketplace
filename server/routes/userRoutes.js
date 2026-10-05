
const express = require("express")
const router = express.Router()

const {getALLUsers,getProfile,updateUser,deleteUser,ChangePassword} = require("../controllers/userController")
const {handleValidationErrors,PasswordChangeValidation,ProfileUpdateValidation} = require("../middlewares/validation")
const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")
const upload = require("../middlewares/uploadMiddleware")

router.get("/",authMiddleware,roleMiddleware,getALLUsers)
router.get("/profile",authMiddleware,getProfile)
router.put("/update",authMiddleware ,upload.single("icon"),ProfileUpdateValidation,handleValidationErrors,updateUser)
router.delete("/delete",authMiddleware,deleteUser)
router.put("/update-password",authMiddleware,PasswordChangeValidation,handleValidationErrors,ChangePassword)

module.exports = router;