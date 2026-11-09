const crypto = require('crypto')
const jwt = require("jsonwebtoken");


const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

const createAccessToken = (id,role,sessionId ) => {
    return jwt.sign(
        { id, role,sessionId },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
}

const createRefreshToken = (id,sessionId) => {
    return jwt.sign(
        { id,sessionId},
        process.env.JWT_REFRESH_SECRET,
        { 
        expiresIn: "7d",
        jwtid: crypto.randomUUID()
        }
    )
}

module.exports = {hashToken,createAccessToken,createRefreshToken}