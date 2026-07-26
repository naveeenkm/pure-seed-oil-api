const Contact = require("../models/contact.model");

const getContact = async () => {
  let contact = await Contact.findOne();
  if (!contact) contact = await Contact.create({});
  return contact;
};

const updateContact = async (data) => {
  let contact = await Contact.findOne();
  if (!contact) return Contact.create(data);
  Object.assign(contact, data);
  await contact.save();
  return contact;
};

module.exports = { getContact, updateContact };
