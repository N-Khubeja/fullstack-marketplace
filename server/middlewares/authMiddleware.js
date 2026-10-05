const jwt = require("jsonwebtoken");
const User = require("../models/User")


// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

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



const authMiddleware =  async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // const user = await User.findById(decoded.id).select("-password")
        const user = await User.findById(decoded.id).select("-password -refreshTokens")

        if(!user){
            return res.status(401).json({message:"user not found"})
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;