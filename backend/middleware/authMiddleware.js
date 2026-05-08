// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.header("Authorization");

//     if (!token) {
//       return res.status(401).json({ message: "Access Denied. Please Login." });
//     }

//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;

//     next();
//   } catch (err) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // 🔥 important

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;