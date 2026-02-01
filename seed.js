const mongoose = require("mongoose");

// --------------------
// MongoDB Connection
// --------------------
const MONGO_URI =
  "mongodb+srv://yadavsk0709_db_user:0KyDfUNKQgixHbRK@food.uyddz4y.mongodb.net/?appName=Food";

// --------------------
// Schemas
// --------------------
const categorySchema = new mongoose.Schema({
  name: String,
  isActive: Boolean
});

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  isVeg: Boolean,
  isAvailable: Boolean,
  imageUrl: String
});

const Category = mongoose.model("Category", categorySchema);
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

// --------------------
// Seed Function
// --------------------
async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data (optional but recommended for seeding)
    await Category.deleteMany();
    await MenuItem.deleteMany();

    console.log("🧹 Existing data cleared");

    // --------------------
    // Create Categories
    // --------------------
    const categories = await Category.insertMany([
      { name: "Burgers", isActive: true },
      { name: "Wraps & Rolls", isActive: true },
      { name: "Snacks", isActive: true },
      { name: "Fries & Sides", isActive: true },
      { name: "Beverages", isActive: true },
      { name: "Tea & Coffee", isActive: true },
      { name: "Combos", isActive: true },
      { name: "Desserts", isActive: true }
    ]);

    console.log("📂 Categories created");

    const [
      burgers,
      wraps,
      snacks,
      fries,
      beverages,
      teaCoffee,
      combos,
      desserts
    ] = categories;

    // --------------------
    // Create Menu Items
    // --------------------
    const menuItems = [
      // Burgers
      {
        name: "Classic Veg Burger",
        description: "Crispy veg patty with fresh lettuce and special sauce.",
        price: 99,
        category: burgers._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400"
      },
      {
        name: "Chicken Burger",
        description: "Juicy chicken patty with mayo and soft bun.",
        price: 149,
        category: burgers._id,
        isVeg: false,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400"
      },
      {
        name: "Paneer Burger",
        description: "Grilled paneer patty with spicy Indian flavors.",
        price: 139,
        category: burgers._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1619881590738-a11199c1d8c2?w=400"
      },

      // Wraps & Rolls
      {
        name: "Veg Frankie Roll",
        description: "Stuffed roll with mixed veggies and chutneys.",
        price: 89,
        category: wraps._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1628294896516-344152572ee8?w=400"
      },
      {
        name: "Chicken Kathi Roll",
        description: "Spicy chicken wrapped in soft roti.",
        price: 129,
        category: wraps._id,
        isVeg: false,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400"
      },

      // Snacks
      {
        name: "Samosa (2 pcs)",
        description: "Crispy samosas filled with spicy potato stuffing.",
        price: 50,
        category: snacks._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400"
      },
      {
        name: "Veg Cutlet",
        description: "Golden fried cutlets with Indian spices.",
        price: 70,
        category: snacks._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1628294896516-344152572ee8?w=400"
      },
      {
        name: "Chicken Pakora",
        description: "Deep fried chicken fritters with crispy coating.",
        price: 120,
        category: snacks._id,
        isVeg: false,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1626078436898-964cc1a7d63f?w=400"
      },

      // Fries & Sides
      {
        name: "Classic French Fries",
        description: "Crispy salted fries.",
        price: 79,
        category: fries._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400"
      },
      {
        name: "Peri Peri Fries",
        description: "Spicy peri peri seasoned fries.",
        price: 99,
        category: fries._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400"
      },

      // Beverages
      {
        name: "Cold Drink",
        description: "Chilled soft drink.",
        price: 50,
        category: beverages._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400"
      },
      {
        name: "Fresh Lime Soda",
        description: "Refreshing lime soda with mint.",
        price: 60,
        category: beverages._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400"
      },

      // Tea & Coffee
      {
        name: "Masala Chai",
        description: "Hot Indian masala tea.",
        price: 30,
        category: teaCoffee._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1594631661960-34762327295c?w=400"
      },
      {
        name: "Cold Coffee",
        description: "Chilled coffee topped with foam.",
        price: 90,
        category: teaCoffee._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400"
      },

      // Combos
      {
        name: "Burger + Fries Combo",
        description: "Veg burger with classic fries.",
        price: 169,
        category: combos._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400"
      },
      {
        name: "Chicken Roll Combo",
        description: "Chicken roll with cold drink.",
        price: 189,
        category: combos._id,
        isVeg: false,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400"
      },

      // Desserts
      {
        name: "Gulab Jamun",
        description: "Soft milk-based sweet soaked in syrup.",
        price: 60,
        category: desserts._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1620985014500-39bda07a48de?w=400"
      },
      {
        name: "Ice Cream Cup",
        description: "Vanilla ice cream scoop.",
        price: 70,
        category: desserts._id,
        isVeg: true,
        isAvailable: true,
        imageUrl:
          "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400"
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log("🍔 Menu items created");

    console.log("🎉 Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
