const Order = require("../models/Order.model");
const MenuItem = require("../models/MenuItem.model");
const User = require("../models/User.model");
const notificationService = require("../services/notification.service");
const emailService = require("../services/email.service");
const { getIO } = require("../sockets/socket");

/* ----------------- CUSTOMER ----------------- */

exports.createOrder = async (req, res) => {
  const { items: rawItems, pickupTime, orderNotes, paymentMethod } = req.body;

  const orderItems = [];
  let totalAmount = 0;

  for (const raw of rawItems) {
    const menuItem = await MenuItem.findById(raw.itemId);
    if (!menuItem || !menuItem.isAvailable) {
      return res.status(400).json({ message: `Item ${raw.itemId} not available` });
    }
    const itemTotal = menuItem.price * (raw.quantity || 1);
    totalAmount += itemTotal;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: raw.quantity || 1,
      instructions: raw.instructions || ""
    });
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalAmount,
    pickupTime: pickupTime || null,
    orderNotes: orderNotes || "",
    paymentMethod: paymentMethod || "online"
  });

  const populatedOrder = await Order.findById(order._id).populate("items.menuItem").lean();

  if (paymentMethod === "cash") {
    try {
      const user = await User.findById(req.user.id).select("email").lean();
      if (user?.email) {
        await emailService.sendOrderConfirmation(user.email, { ...populatedOrder, orderNumber: order.orderNumber });
      }
      await notificationService.sendNotification({
        userId: req.user.id.toString(),
        title: "Order Confirmed",
        message: `Order #${order.orderNumber} confirmed. We'll notify you when it's ready for pickup.`,
        type: "order"
      });
    } catch (err) {
      console.error("Order notification error:", err);
    }
  }

  res.status(201).json({ ...populatedOrder, orderNumber: order.orderNumber });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("items.menuItem");

  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id
  })
    .populate("items.menuItem");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

/* ----------------- ADMIN ----------------- */

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name phone")
    .populate("items.menuItem")
    .sort({ createdAt: -1 });

  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = req.body.status;
  await order.save();

  try {
    await notificationService.sendNotification({
      userId: order.user.toString(),
      title: "Order Update",
      message: `Your order #${order.orderNumber} is now ${order.status}`,
      type: "order"
    });

    if (req.body.status === "ready") {
      const user = await User.findById(order.user).select("email").lean();
      if (user?.email) {
        await emailService.sendOrderReadyForPickup(user.email, order);
      }
    }
  } catch (err) {
    console.error("Notification error:", err);
  }

  const io = getIO();
  io.to(order.user.toString()).emit("orderStatusUpdate", { orderId: order._id, status: order.status });

  res.json(order);
};
