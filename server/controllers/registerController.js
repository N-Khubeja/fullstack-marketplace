const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const {sendPasswordResetEmail} = require('../services/emailService')

const {createAccessToken,createRefreshToken,hashToken} = require('../utils/tokenUtils')
const normalizeEmail = require("../utils/normalizeEmail")

async function authUser(req, res) {
  try {
    const {
      name,
      email,
      password
    } = req.body

    const normalizedEmail =
      normalizeEmail(email)

    const existing =
      await User.findOne({
        email: normalizedEmail
      })

    if (existing) {
      return res.status(409).json({
        code:
          "EMAIL_ALREADY_EXISTS",

        message:
          "Email already exists"
      })
    }

    const salt =
      await bcrypt.genSalt(10)

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      )

    const user =
      await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword
      })

    return res
      .status(201)
      .json({
        message:
          "User registered",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          icon: user.icon
        }
      })

  } catch (error) {

    if (
      error?.code === 11000 &&
      error?.keyPattern?.email
    ) {
      return res.status(409).json({
        code:
          "EMAIL_ALREADY_EXISTS",

        message:
          "Email already exists"
      })
    }

    console.error(
      "Register error:",
      error
    )

    return res.status(500).json({
      message:
        "Something went wrong"
    })
  }
}

async function LoginUser(req,res){
  const sessionId = crypto.randomUUID()

    try {
        const {email,password} = req.body

        const normalizedEmail = normalizeEmail(email)

        const user = await User.findOne({email: normalizedEmail})
        if(!user){
          return res.status(401).json({
  code: "INVALID_CREDENTIALS",
  message:
    "Invalid email or password"
})
        }

        const passwordCheck = await bcrypt.compare(password,user.password)

        if(!passwordCheck){
           return res.status(401).json({
  code: "INVALID_CREDENTIALS",
  message:
    "Invalid email or password"
})
        }

        const accessToken = createAccessToken(user._id,user.role,sessionId)

        const refreshToken = createRefreshToken(user._id,sessionId)

        if (user.refreshTokens.length >= 5) {
            user.refreshTokens.shift()
        }

        user.refreshTokens.push({
            token: hashToken(refreshToken),
            device: req.headers['user-agent'] || 'unknown',
            createdAt: new Date(),
            sessionId
        })
        await user.save()

        res.cookie('refreshToken', refreshToken, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'lax',
           maxAge: 7 * 24 * 60 * 60 * 1000,
           path: '/'
        });
        
        res.status(200).json({
            message:"login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: normalizeEmail(user.email),
                role: user.role,
                icon:user.icon
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

async function logoutUser(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      )

      const user = await User.findById(
        decoded.id
      )

      if (user) {
        user.refreshTokens =
          user.refreshTokens.filter(
            t =>
              t.token !==
              hashToken(refreshToken)
          )

        await user.save()
      }
    }
  } catch (error) {
    console.log(
      "Logout token revoke failed:",
      error.message
    )
  } finally {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/"
    })

    return res.status(200).json({
      message: "Logged out"
    })
  }
}

async function refreshUserToken(req, res) {

  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
  code: "NO_REFRESH_TOKEN",
  message: "No refresh token"
})
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    )

    const oldTokenHash =
      hashToken(refreshToken)

    const newRefreshToken =
      createRefreshToken(decoded.id,decoded.sessionId)

    const updatedUser =
      await User.findOneAndUpdate(
        {
          _id: decoded.id,
          "refreshTokens.token": oldTokenHash
        },
        {
          $set: {
            "refreshTokens.$.token":
              hashToken(newRefreshToken)
          }
        },
        {
          new: true
        }
      )

    if (!updatedUser) {
      return res.status(403).json({
  code: "INVALID_REFRESH_TOKEN",
  message:
    "Invalid refresh token"
})
    }

    const newAccessToken =
      createAccessToken(
        updatedUser._id,
        updatedUser.role,
        decoded.sessionId
      )

    res.cookie(
      "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
        path: "/"
      }
    )

    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        icon: updatedUser.icon
      }
    })

  } catch (error) {
    return res.status(403).json({
  code: "INVALID_REFRESH_TOKEN",
  message:
    "Invalid or expired refresh token"
})
  }
}

async function forgetPassword(req, res) {
  try {
    const { email } = req.body

    const normalizedEmail = normalizeEmail(email)

    const existingUser = await User.findOne({
  email: normalizedEmail
})

        if (!existingUser) {
        return res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent.",
        })
        }

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex")

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    existingUser.passwordResetToken =
      resetTokenHash

    existingUser.passwordResetExpires =
      new Date(Date.now() + 15 * 60 * 1000)

    await existingUser.save()

    const resetUrl =
      `${process.env.FRONTEND_URL}` +
      `/reset-password?token=${resetToken}`

    try {
      await sendPasswordResetEmail({
        to:existingUser.email,
        name:existingUser.name,
        resetUrl:resetUrl
      }
      )
    } catch (emailError) {
      existingUser.passwordResetToken = null
      existingUser.passwordResetExpires = null

      await existingUser.save()

      console.error(
        "Password reset email failed:",
        emailError
      )
    }

    return res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error(
      "Forgot password controller error:",
      error
    )

    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

async function resetPassword(req,res){

   try {
         const {token,newPassword} = req.body

    const resetTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: resetTokenHash,
        passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid or expired reset token",
        });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword
    user.refreshTokens = []
    user.passwordResetToken = null
    user.passwordResetExpires = null

    await user.save()

     res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return res.status(200).json({message:"passwords are updated"})
   } catch (error) {
     console.error(
      "Reset password error:",
      error
    )

    return res.status(500).json({
      message: "Something went wrong"
    })
   }

}


module.exports = {authUser,LoginUser,refreshUserToken,logoutUser,forgetPassword,resetPassword}