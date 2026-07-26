const Oil = require("../models/oil.model");

const LIST_SELECT = { "image.data": 0 };

const getOils = async ({ status } = {}) => {
  const filter = status ? { status } : {};
  return Oil.find(filter, LIST_SELECT).sort({ displayOrder: 1, createdAt: 1 });
};

const getOilById = async (id) => Oil.findById(id, LIST_SELECT);

const createOil = async (data, file) => {
  const image = file
    ? { data: file.buffer, contentType: file.mimetype, filename: file.originalname }
    : undefined;
  return (await Oil.create({ ...data, ...(image && { image }) })).toObject({ versionKey: false });
};

const updateOil = async (id, data, file) => {
  const oil = await Oil.findById(id);
  if (!oil) return null;
  Object.assign(oil, data);
  if (file) oil.image = { data: file.buffer, contentType: file.mimetype, filename: file.originalname };
  await oil.save();
  const obj = oil.toObject({ versionKey: false });
  delete obj.image?.data;
  return obj;
};

const deleteOil = async (id) => Oil.findByIdAndDelete(id);

const getImageById = async (id) => {
  const oil = await Oil.findById(id);
  return oil?.image?.data ? oil.image : null;
};

module.exports = { getOils, getOilById, createOil, updateOil, deleteOil, getImageById };
