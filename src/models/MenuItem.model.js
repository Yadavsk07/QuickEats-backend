const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    isVeg: Boolean,
    isAvailable: {
      type: Boolean,
      default: true
    },
    imageUrl: String
  },
  { timestamps: true }
);

menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
