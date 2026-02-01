const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true
    },
    phone: {
      type: String,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
