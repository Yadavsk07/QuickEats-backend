const Order = require("../models/Order.model");
const User = require("../models/User.model");
const MenuItem = require("../models/MenuItem.model");
const Category = require("../models/Category.model");

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalOrders, todayOrders, totalUsers, totalMenuItems, recentOrders] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
        User.countDocuments({ role: "customer" }),
        MenuItem.countDocuments(),
        Order.find()
          .populate("user", "name phone")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const [todayRevenue, totalRevenue] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalUsers,
      totalMenuItems,
      todayRevenue: todayRevenue[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus: ordersByStatus.reduce((acc, o) => {
        acc[o._id] = o.count;
        return acc;
      }, {}),
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const [dailyRevenue, popularItems] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.name", count: { $sum: "$items.quantity" } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({ dailyRevenue, popularItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone email")
      .populate("items.menuItem")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
      .populate("user", "name phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { getIO } = require("../sockets/socket");
    const io = getIO();
    io.to(order.user._id.toString()).emit("orderStatusUpdate", {
      orderId: order._id,
      status: order.status
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot block admin user" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().populate("category").sort({ createdAt: -1 }).lean();
    const categories = await Category.find({ isActive: true }).lean();
    res.json({ items, categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isVeg, isAvailable, imageUrl } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Item name is required" });
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }
    const item = await MenuItem.create({
      name: name.trim(),
      description: description ? String(description).trim() : "",
      price: priceNum,
      category,
      isVeg: Boolean(isVeg),
      isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
      imageUrl: imageUrl ? String(imageUrl).trim() : undefined
    });
    const populated = await MenuItem.findById(item._id).populate("category").lean();
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
