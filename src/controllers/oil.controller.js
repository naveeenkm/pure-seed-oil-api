const service = require("../services/oil.service");

const getAll = async (req, res, next) => {
  try {
    const oils = await service.getOils(req.query);
    res.json({ success: true, data: oils });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const oil = await service.getOilById(req.params.id);
    if (!oil) return res.status(404).json({ success: false, message: "Oil not found" });
    res.json({ success: true, data: oil });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const oil = await service.createOil(req.body, req.file);
    res.status(201).json({ success: true, data: oil });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const oil = await service.updateOil(req.params.id, req.body, req.file);
    if (!oil) return res.status(404).json({ success: false, message: "Oil not found" });
    res.json({ success: true, data: oil });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const oil = await service.deleteOil(req.params.id);
    if (!oil) return res.status(404).json({ success: false, message: "Oil not found" });
    res.json({ success: true, message: "Oil deleted" });
  } catch (err) { next(err); }
};

const getImage = async (req, res, next) => {
  try {
    const image = await service.getImageById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: "Image not found" });
    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, getImage };
