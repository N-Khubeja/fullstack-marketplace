// const jwt = require("jsonwebtoken");
// const User = require("../models/User")



// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (
//       !authHeader ||
//       !authHeader.startsWith("Bearer ")
//     ) {
//       return res.status(401).json({
//         message: "Authorization token is required"
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         message: "Authorization token is required"
//       });
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     const user = await User
//       .findById(decoded.id)
//       .select("-password -refreshTokens");

//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid or expired token"
//       });
//     }

//     req.user = user;

//     return next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Invalid or expired token"
//     });
//   }
// };

// module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const authMiddleware =  async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ message: "No token provided" });
//         }

//         const token = authHeader.split(" ")[1];

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.id).select("-password")

//         if(!user){
//             return res.status(401).json({message:"user not found"})
//         }

//         const sessionExists = user.refreshTokens.some((token) => token.sessionId === decoded.sessionId)

//         if(!sessionExists){
//             return res.status(401).json({
//                 message: "Session expired"
//             })
//         }

//         req.user = user;

//         next();

//     } catch (error) {
//         return res.status(401).json({ message: "Invalid or expired token" });
//     }
// };

const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        code: "NO_ACCESS_TOKEN",
        message: "Authentication required"
      })
    }

    const token =
      authHeader.split(" ")[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await User.findOne({
      _id: decoded.id,

      "refreshTokens.sessionId":
        decoded.sessionId
    }).select(
      "_id name email role icon"
    )

    if (!user) {
      return res.status(401).json({
        code: "SESSION_EXPIRED",
        message: "Session expired"
      })
    }

    req.user = user

    next()

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "ACCESS_TOKEN_EXPIRED",
        message: "Access token expired"
      })
    }

    return res.status(401).json({
      code: "INVALID_ACCESS_TOKEN",
      message: "Invalid access token"
    })
  }
}

module.exports = authMiddleware

