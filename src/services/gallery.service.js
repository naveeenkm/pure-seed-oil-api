const Gallery = require("../models/gallery.model");

const LIST_SELECT = { "image.data": 0 };

const getGallery = async ({ status } = {}) => {
  const filter = status ? { status } : {};
  return Gallery.find(filter, LIST_SELECT).sort({ displayOrder: 1, createdAt: 1 });
};

const getItemById = async (id) => Gallery.findById(id, LIST_SELECT);

const createItem = async (data, file) => {
  if (!file) throw Object.assign(new Error("Image is required"), { status: 400 });
  const image = { data: file.buffer, contentType: file.mimetype, filename: file.originalname };
  return (await Gallery.create({ ...data, image })).toObject({ versionKey: false });
};

const updateItem = async (id, data, file) => {
  const item = await Gallery.findById(id);
  if (!item) return null;
  Object.assign(item, data);
  if (file) item.image = { data: file.buffer, contentType: file.mimetype, filename: file.originalname };
  await item.save();
  const obj = item.toObject({ versionKey: false });
  delete obj.image?.data;
  return obj;
};

const deleteItem = async (id) => Gallery.findByIdAndDelete(id);

const getImageById = async (id) => {
  const item = await Gallery.findById(id);
  return item?.image?.data ? item.image : null;
};

module.exports = { getGallery, getItemById, createItem, updateItem, deleteItem, getImageById };
