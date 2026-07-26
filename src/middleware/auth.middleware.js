const requireAdmin = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Cookie Header:", req.headers.cookie);

    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token",
        cookies: req.cookies,
        cookieHeader: req.headers.cookie || null,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};