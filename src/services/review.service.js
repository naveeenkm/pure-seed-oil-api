const Review = require("../models/review.model");

const createReview = async (data, files = []) => {
  const images = files.map((f) => ({
    data: f.buffer,
    contentType: f.mimetype,
    filename: f.originalname,
  }));
  const review = await Review.create({ ...data, images });
  review.phone = undefined;
  review.email = undefined;
  return review;
};

const EXCLUDE = "-images.data -phone -email";

const getReviews = async ({ page = 1, limit = 10, rating, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  else filter.status = "approved"; // public default
  if (rating) filter.rating = Number(rating);

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select(EXCLUDE),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + reviews.length < total,
    },
  };
};

const getReviewById = async (id) => {
  return await Review.findById(id).select(EXCLUDE);
};

const updateReview = async (id, data) => {
  return await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select(EXCLUDE);
};

const deleteReview = async (id) => {
  return await Review.findByIdAndDelete(id);
};

const incrementHelpful = async (id) => {
  return await Review.findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true }).select(EXCLUDE);
};

const getStats = async () => {
  const [approvedStats, counts] = await Promise.all([
    Review.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },
    ]),
    Review.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const statusMap = { pending: 0, approved: 0, rejected: 0 };
  counts.forEach(({ _id, count }) => { if (_id in statusMap) statusMap[_id] = count; });

  if (!approvedStats.length) {
    return { totalReviews: statusMap.pending + statusMap.approved + statusMap.rejected, averageRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, ...statusMap };
  }

  const { totalReviews, averageRating, rating1, rating2, rating3, rating4, rating5 } = approvedStats[0];
  return {
    totalReviews: statusMap.pending + statusMap.approved + statusMap.rejected,
    approvedCount: totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    distribution: { 1: rating1, 2: rating2, 3: rating3, 4: rating4, 5: rating5 },
    ...statusMap,
  };
};

const getImageById = async (reviewId, imageIndex) => {
  const review = await Review.findById(reviewId);
  if (!review || !review.images[imageIndex]) return null;
  return review.images[imageIndex];
};

module.exports = { createReview, getReviews, getReviewById, updateReview, deleteReview, incrementHelpful, getStats, getImageById };
