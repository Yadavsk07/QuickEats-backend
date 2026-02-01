const Otp = require("../models/Otp.model");
const { generateOtp } = require("../utils/otp");
const emailService = require("./email.service");

exports.sendOtp = async (user) => {
  const otp = generateOtp();

  await Otp.deleteMany({ userId: user._id });

  await Otp.create({
    userId: user._id,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  });

  const message = `Your password reset OTP is ${otp}. Valid for 5 minutes.`;
  if (user.email) {
    await emailService.sendEmail(
      user.email,
      "Password Reset OTP",
      `<p>${message}</p>`
    );
    console.log("[OTP] Sent to email:", user.email);
  } else {
    console.log("[OTP] User has no email; OTP not sent. (Dev fallback:", otp, ")");
  }
  if (process.env.NODE_ENV === "development") {
    console.log("[OTP] Password reset OTP for", user.email || user.phone, ":", otp);
  }
};

exports.verifyOtp = async (userId, otp) => {
  const record = await Otp.findOne({ userId, otp });
  if (!record) return false;

  await Otp.deleteMany({ userId });
  return true;
};
