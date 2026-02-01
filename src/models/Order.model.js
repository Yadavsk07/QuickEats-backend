const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem"
        },
        name: String,
        price: Number,
        quantity: Number,
        instructions: String
      }
    ],
    totalAmount: Number,
    pickupTime: String,
    orderNotes: String,
    paymentMethod: {
      type: String,
      enum: ["online", "cash"],
      default: "online"
    },
    status: {
      type: String,
      enum: ["accepted", "preparing", "ready", "collected", "cancelled"],
      default: "accepted"
    }
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
