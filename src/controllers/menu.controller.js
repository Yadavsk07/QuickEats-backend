const Category = require("../models/Category.model");
const MenuItem = require("../models/MenuItem.model");

/* ----------------- CATEGORY ----------------- */

exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};

/* ----------------- MENU ITEMS ----------------- */

exports.createMenuItem = async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
};

exports.getMenuItems = async (req, res) => {
  const { category } = req.query;

  const filter = { isAvailable: true };
  if (category) filter.category = category;

  const items = await MenuItem.find(filter).populate("category");
  res.json(items);
};

exports.updateMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(item);
};

exports.toggleAvailability = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  item.isAvailable = !item.isAvailable;
  await item.save();

  res.json(item);
};
