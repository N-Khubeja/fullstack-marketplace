const rateLimit = require("express-rate-limit")

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many password reset requests. Please try again later."
  }
})

module.exports = forgotPasswordLimiter