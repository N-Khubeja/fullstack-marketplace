const express = require("express")
const router = express.Router()

const {authUser,LoginUser,logoutUser,refreshUserToken,forgetPassword,resetPassword} = require("../controllers/registerController")
const authMiddleware = require("../middlewares/authMiddleware")
const {LoginValidation,RegisterValidation,handleValidationErrors,ForgetPasswordValidation,ResetPassword} = require('../middlewares/validation')
const forgotPasswordLimiter = require("../middlewares/rateLimit")


router.post('/register',RegisterValidation,handleValidationErrors,authUser)
router.post('/login',LoginValidation,handleValidationErrors,LoginUser)
router.post('/logout',logoutUser)
router.post('/refresh',refreshUserToken)
router.post('/forget-password',forgotPasswordLimiter,ForgetPasswordValidation,handleValidationErrors,forgetPassword)
router.post('/reset-password',ResetPassword,handleValidationErrors,resetPassword)

module.exports = router