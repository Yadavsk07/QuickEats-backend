/**
 * Script to create an admin user.
 * Run: node scripts/create-admin.js
 * Or with email: ADMIN_EMAIL=admin@example.com node scripts/create-admin.js
 *
 * Set ADMIN_EMAIL and ADMIN_PASSWORD in .env, or pass as env vars when running.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../src/models/User.model");
const { hashPassword } = require("../src/utils/password");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@foodorder.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({
      $or: [{ email: ADMIN_EMAIL }, { role: "admin" }]
    });

    if (existing) {
      if (existing.role === "admin") {
        console.log("Admin user already exists:", existing.email || existing.phone);
      } else {
        existing.role = "admin";
        await existing.save();
        console.log("Updated user to admin:", existing.email || existing.phone);
      }
    } else {
      const hashedPassword = await hashPassword(ADMIN_PASSWORD);
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin"
      });
      console.log("Admin user created:", ADMIN_EMAIL);
      console.log("Login with:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
