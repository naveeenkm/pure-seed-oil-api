const service = require("../services/admin.service");

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

if (COOKIE_DOMAIN) {
  COOKIE_OPTS.domain = COOKIE_DOMAIN;
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const { token, admin } = await service.login(email, password);
    res.cookie("admin_token", token, COOKIE_OPTS);
    const setCookieHeader = res.getHeader && res.getHeader('Set-Cookie');
    console.log('Set-Cookie header on login:', setCookieHeader);
    res.json({ success: true, data: admin, token });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  const clearOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };
  if (COOKIE_DOMAIN) clearOpts.domain = COOKIE_DOMAIN;
  res.clearCookie("admin_token", clearOpts);
  res.json({ success: true, message: "Logged out" });
};

const me = (req, res) => {
  const { _id, username, email, role, phone, lastLogin, isActive, createdAt } = req.admin;
  res.json({ success: true, data: { _id, username, email, role, phone, lastLogin, isActive, createdAt } });
};

const getDashboardStats = async (req, res, next) => {
  try {
    const data = await service.getDashboardStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await service.changePassword(req.admin._id.toString(), req.body);
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    const admins = await service.getAdmins();
    res.json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const admin = await service.createAdmin(req.body);
    res.status(201).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    // Only superadmin can change roles or update other admins
    const isSelf = req.params.id === req.admin._id.toString();
    const isSuperAdmin = req.admin.role === "superadmin";
    if (!isSelf && !isSuperAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    // Only superadmin can change role
    if (req.body.role && !isSuperAdmin) {
      return res.status(403).json({ success: false, message: "Only superadmin can change roles" });
    }
    const admin = await service.updateAdmin(req.params.id, req.body);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    res.json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    if (req.admin.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Only superadmin can delete admins" });
    }
    await service.deleteAdmin(req.params.id, req.admin._id.toString());
    res.json({ success: true, message: "Admin deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, me, getAdmins, createAdmin, updateAdmin, deleteAdmin, getDashboardStats, changePassword };
