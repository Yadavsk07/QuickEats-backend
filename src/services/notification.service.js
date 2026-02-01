const Notification = require("../models/Notification.model");
const { getIO } = require("../sockets/socket");

exports.sendNotification = async ({
  userId,
  title,
  message,
  type = "system"
}) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type
  });

  const io = getIO();
  io.to(userId.toString()).emit("notification", notification);

  return notification;
};
