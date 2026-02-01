const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: Number,
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    }
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
