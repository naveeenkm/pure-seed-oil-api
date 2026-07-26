const mongoose = require("mongoose");

const oilSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, trim: true },
    image: { data: Buffer, contentType: String, filename: String },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

oilSchema.index({ status: 1, displayOrder: 1 });

module.exports = mongoose.model("Oil", oilSchema);
