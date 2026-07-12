const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: [
      {
        data: Buffer,
        contentType: String,
        filename: String,
      },
    ],
    verifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "approved"], default: "approved" },
  },
  { timestamps: true }
);

reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
