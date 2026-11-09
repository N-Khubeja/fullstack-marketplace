const express = require("express")
const router = express.Router()

const {authUser,LoginUser,logoutUser,refreshUserToken,forgetPassword,resetPassword} = require("../controllers/registerController")
const {LoginValidation,RegisterValidation,handleValidationErrors,ForgetPasswordValidation,ResetPassword} = require('../middlewares/validation')
const {forgotPasswordLimiter,loginIpLimiter,loginAccountLimiter} = require("../middlewares/rateLimit")


router.post('/register',RegisterValidation,handleValidationErrors,authUser)
router.post('/login',loginIpLimiter,LoginValidation,handleValidationErrors,loginAccountLimiter,LoginUser)
router.post('/logout',logoutUser)
router.post('/refresh',refreshUserToken)
router.post('/forget-password',forgotPasswordLimiter,ForgetPasswordValidation,handleValidationErrors,forgetPassword)
router.post('/reset-password',ResetPassword,handleValidationErrors,resetPassword)

module.exports = router