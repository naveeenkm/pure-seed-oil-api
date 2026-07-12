const service = require("../services/review.service");

const create = async (req, res, next) => {
  try {
    const review = await service.createReview(req.body, req.files || []);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await service.getReviews(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const review = await service.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const review = await service.updateReview(req.params.id, req.body);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const review = await service.deleteReview(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};

const helpful = async (req, res, next) => {
  try {
    const review = await service.incrementHelpful(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

const stats = async (req, res, next) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getImage = async (req, res, next) => {
  try {
    const image = await service.getImageById(req.params.id, req.params.index);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, remove, helpful, stats, getImage };
