/**
 * Seed script — populates MongoDB with default users and a welcome article.
 *
 * Usage: node src/scripts/seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Article = require("../models/Article");

const seedUsers = [
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "password",
    role: "admin",
  },
  {
    name: "Editor User",
    email: "editor@test.com",
    password: "password",
    role: "editor",
  },
  {
    name: "Viewer User",
    email: "viewer@test.com",
    password: "password",
    role: "viewer",
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    /* Clear existing data */
    await User.deleteMany({});
    await Article.deleteMany({});
    console.log("Cleared existing data");

    /* Seed users */
    const createdUsers = await User.create(seedUsers);
    console.log(`Created ${createdUsers.length} users`);

    /* Find the admin user to link the welcome article */
    const admin = createdUsers.find(u => u.role === "admin");

    /* Seed articles with proper references */
    await Article.create([
      {
        title: "Welcome Article",
        content: "This article is visible to all authenticated roles.",
        createdBy: admin._id,
        authorName: admin.name,
      },
    ]);
    console.log("Created welcome article");

    console.log("\nSeed complete!");
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
