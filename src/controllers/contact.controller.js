const service = require("../services/contact.service");

const get = async (req, res, next) => {
  try {
    const contact = await service.getContact();
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const contact = await service.updateContact(req.body);
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
};

module.exports = { get, update };
