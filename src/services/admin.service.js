const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || "Admin";
  if (!email || !password) return;
  const exists = await Admin.findOne({ email });
  if (!exists) {
    await Admin.create({ username, email, password, role: "superadmin" });
    console.log("Super Admin seeded:", email);
  } else if (!exists.role) {
    // Migrate existing admin to superadmin
    await Admin.updateOne({ email }, { role: "superadmin" });
    console.log("Migrated admin to superadmin:", email);
  }
};

const login = async (email, password) => {
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }
  admin.lastLogin = new Date();
  await admin.save();
  return {
    token: signToken(admin._id),
    admin: { _id: admin._id, username: admin.username, email: admin.email, role: admin.role, phone: admin.phone, lastLogin: admin.lastLogin, isActive: admin.isActive, createdAt: admin.createdAt },
  };
};

const getAdmins = async () => Admin.find({}, "-password").sort({ createdAt: 1 });

const createAdmin = async (data) => {
  const admin = await Admin.create(data);
  return { _id: admin._id, username: admin.username, email: admin.email, role: admin.role, phone: admin.phone, isActive: admin.isActive, createdAt: admin.createdAt };
};

const updateAdmin = async (id, data) => {
  const admin = await Admin.findById(id).select("+password");
  if (!admin) throw Object.assign(new Error("Not found"), { status: 404 });
  if (data.username !== undefined) admin.username = data.username;
  if (data.email !== undefined) admin.email = data.email;
  if (data.phone !== undefined) admin.phone = data.phone;
  if (data.role !== undefined) admin.role = data.role;
  if (data.isActive !== undefined) admin.isActive = data.isActive;
  await admin.save();
  return { _id: admin._id, username: admin.username, email: admin.email, role: admin.role, phone: admin.phone, isActive: admin.isActive, createdAt: admin.createdAt, lastLogin: admin.lastLogin };
};

const changePassword = async (id, { oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) throw Object.assign(new Error("Old and new passwords are required"), { status: 400 });
  const admin = await Admin.findById(id).select("+password");
  if (!admin) throw Object.assign(new Error("Not found"), { status: 404 });
  const valid = await admin.comparePassword(oldPassword);
  if (!valid) throw Object.assign(new Error("Current password is incorrect"), { status: 401 });
  admin.password = newPassword;
  await admin.save();
  return { success: true };
};

const deleteAdmin = async (id, requesterId) => {
  if (id === requesterId) throw Object.assign(new Error("Cannot delete yourself"), { status: 400 });
  return Admin.findByIdAndDelete(id);
};

const getDashboardStats = async () => {
  const Review = require("../models/review.model");
  const [totalAdmins, reviewCounts] = await Promise.all([
    Admin.countDocuments(),
    Review.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);
  const stats = { pending: 0, approved: 0, rejected: 0 };
  reviewCounts.forEach(({ _id, count }) => { if (_id in stats) stats[_id] = count; });
  const totalReviews = stats.pending + stats.approved + stats.rejected;
  return { totalAdmins, totalReviews, ...stats };
};

module.exports = { seedAdmin, login, getAdmins, createAdmin, updateAdmin, changePassword, deleteAdmin, getDashboardStats };
