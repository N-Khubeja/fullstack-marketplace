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

const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many login attempts. Please try again later."
  }
})


const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => {
  return req.body.email
    .trim()
    .toLowerCase()
},

skipSuccessfulRequests: true,

  message: {
    message:
      "Too many login attempts. Please try again later."
  }

})

module.exports = {forgotPasswordLimiter,loginIpLimiter,loginAccountLimiter}