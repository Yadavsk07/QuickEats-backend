const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const errorHandler = require("./middlewares/error.middleware");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const passwordRoutes = require("./routes/password.routes");
const paymentRoutes = require("./routes/payment.routes");
const notificationRoutes = require("./routes/notification.routes");


const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean)
  : ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Food Order App Backend is running");
// });

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

module.exports = app;
