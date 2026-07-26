const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const requireAdmin = async (req, res, next) => {
  try {
     console.log("Cookies:", req.cookies);
    console.log("Cookie Header:", req.headers.cookie);
    let token = req.cookies?.admin_token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
        console.log("Using token from Authorization header");
      }
    }
    
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ success: false, message: "Admin not found" });
    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { requireAdmin };
