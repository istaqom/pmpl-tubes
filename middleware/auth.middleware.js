const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: "You don't have access to this endpoint" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Invalid token. Please log in again." });
  }
};

// Authorization Middleware
exports.authorizeOperator = (req, res, next) => {
  if (req.user.role !== "operator") {
    return res.status(401).json({
      error: "You don't have access to this endpoint",
    });
  }
  next();
};

exports.authorizeKoordinator = (req, res, next) => {
  if (req.user.role !== "koordinator") {
    return res.status(401).json({
      error: "You don't have access to this endpoint",
    });
  }
  next();
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "koordinator" && req.user.role !== "operator") {
      return res.status(401).json({
        error: "You don't have access to this endpoint",
      });
    }
    next();
  };
