const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone is required" });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const isAdminEmail = adminEmail && (email?.toLowerCase() === adminEmail || phone === process.env.ADMIN_PHONE);
  const role = isAdminEmail ? "admin" : "customer";

  await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role
  });

  res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }]
  });

  if (!user || user.isBlocked) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: user._id,
    role: user.role
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
};
