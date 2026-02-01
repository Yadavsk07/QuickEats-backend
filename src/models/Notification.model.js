const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["order", "payment", "system"]
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
