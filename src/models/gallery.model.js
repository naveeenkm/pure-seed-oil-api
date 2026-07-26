const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    caption: { type: String, trim: true, default: "" },
    image: { data: Buffer, contentType: String, filename: String },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

gallerySchema.index({ status: 1, displayOrder: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
