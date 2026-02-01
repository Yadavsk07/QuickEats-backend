const Order = require("../models/Order.model");
const Payment = require("../models/Payment.model");
const User = require("../models/User.model");
const razorpayService = require("../services/razorpay.service");
const { verifyRazorpaySignature } = require("../utils/payment");
const notificationService = require("../services/notification.service");
const emailService = require("../services/email.service");

/* STEP 1: CREATE PAYMENT ORDER */
exports.createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const razorpayOrder = await razorpayService.createOrder(
    order.totalAmount
  );

  const payment = await Payment.create({
    orderId: order._id,
    userId: req.user.id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.totalAmount
  });

  res.json({
    razorpayOrderId: razorpayOrder.id,
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.totalAmount,
    currency: "INR",
    paymentId: payment._id
  });
};

/* STEP 2: VERIFY PAYMENT */
exports.verifyPayment = async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentId
  } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ message: "Payment record not found" });
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature
  });

  if (!isValid) {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  payment.status = "paid";
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  await payment.save();

  await Order.findByIdAndUpdate(payment.orderId, {
    status: "accepted"
  });

  const order = await Order.findById(payment.orderId).populate("items.menuItem").lean();
  await notificationService.sendNotification({
    userId: payment.userId.toString(),
    title: "Payment Successful",
    message: `Payment received for Order #${order?.orderNumber || payment.orderId}. We'll notify you when it's ready for pickup.`,
    type: "payment"
  });

  const user = await User.findById(payment.userId).select("email").lean();
  if (order && user?.email) {
    try {
      await emailService.sendPaymentConfirmation(user.email, order);
    } catch (e) {
      console.error("[Payment] Email send error:", e.message);
    }
  }

  res.json({ message: "Payment verified successfully" });
};
