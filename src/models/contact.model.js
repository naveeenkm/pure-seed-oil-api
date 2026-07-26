const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    alternatePhone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    alternateEmail: { type: String, trim: true, lowercase: true, default: "" },
    googleMapsLink: { type: String, trim: true, default: "" },
    googleMapsEmbed: { type: String, trim: true, default: "" },
    businessHours: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    facebook: { type: String, trim: true, default: "" },
    youtube: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
