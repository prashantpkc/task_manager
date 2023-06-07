const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const {token} = req.cookies;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Please log in to access this resource",
      });
    }
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

     req.user = await User.findById(decodedData.userId);
    
    next();
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: `Role: ${req.user.role} is not allowed to access this resource`,
      });
    }

    next();
  };
};
