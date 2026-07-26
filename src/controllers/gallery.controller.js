const service = require("../services/gallery.service");

const getAll = async (req, res, next) => {
  try {
    const items = await service.getGallery(req.query);
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const item = await service.createItem(req.body, req.file);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await service.updateItem(req.params.id, req.body, req.file);
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const item = await service.deleteItem(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Gallery item not found" });
    res.json({ success: true, message: "Gallery item deleted" });
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

module.exports = { getAll, create, update, remove, getImage };
