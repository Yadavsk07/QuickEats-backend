const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/password");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, email, phone } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  await user.save();

  const updated = await User.findById(user._id).select("-password");
  res.json(updated);
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.json({ message: "Password changed successfully" });
};

exports.deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "Account deleted successfully" });
};
