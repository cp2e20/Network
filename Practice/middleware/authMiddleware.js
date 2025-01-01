const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization"); // Extract token from the request header
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
