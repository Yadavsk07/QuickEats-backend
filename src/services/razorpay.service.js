const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (amount) => {
  const amountPaise = Math.round(Number(amount) * 100);
  return await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    payment_capture: 1
  });
};
