const User = require("../models/User.model");
const { sendOtp, verifyOtp } = require("../services/otp.service");
const { hashPassword } = require("../utils/password");

/** Normalize identifier so we find user whether they typed 9876543210 or +919876543210 and DB has either. */
function normalizeIdentifierForLookup(identifier) {
  if (!identifier || typeof identifier !== "string") return []; 
  const trimmed = identifier.trim().toLowerCase();
  const digits = trimmed.replace(/\D/g, "");
  const values = [trimmed];
  if (digits.length === 10 && /^\d+$/.test(digits)) {
    values.push(digits, "+91" + digits, "91" + digits);
  } else if (digits.length >= 10) {
    values.push(digits, "+" + digits);
    if (digits.startsWith("91")) values.push(digits.slice(2));
  }
  return [...new Set(values)];
}

/* STEP 1: REQUEST OTP */
exports.requestReset = async (req, res) => {
  const { identifier } = req.body;

  const possible = normalizeIdentifierForLookup(identifier);
  const user = await User.findOne({
    $or: [
      { email: { $in: possible } },
      { phone: { $in: possible } }
    ]
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.email || !user.email.trim()) {
    return res.status(400).json({ message: "Password reset is only available for accounts with an email address. This account has no email on file." });
  }

  await sendOtp(user);
  res.json({ message: "OTP sent to your email" });
};

/* STEP 2: VERIFY OTP */
exports.verifyResetOtp = async (req, res) => {
  const { identifier, otp } = req.body;

  const possible = normalizeIdentifierForLookup(identifier);
  const user = await User.findOne({
    $or: [
      { email: { $in: possible } },
      { phone: { $in: possible } }
    ]
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await verifyOtp(user._id, otp);
  if (!valid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified" });
};

/* STEP 3: RESET PASSWORD */
exports.resetPassword = async (req, res) => {
  const { identifier, otp, newPassword } = req.body;

  const possible = normalizeIdentifierForLookup(identifier);
  const user = await User.findOne({
    $or: [
      { email: { $in: possible } },
      { phone: { $in: possible } }
    ]
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await verifyOtp(user._id, otp);
  if (!valid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.json({ message: "Password reset successful" });
};
