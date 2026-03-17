/**
 * Seed script — populates MongoDB with default users and a welcome article.
 *
 * Usage: node src/scripts/seed.js
 *
 * This script:
 *   1. Connects to MongoDB using MONGODB_URI from .env
 *   2. Clears existing users and articles
 *   3. Creates 3 seed users (admin, editor, viewer)
 *   4. Creates 1 welcome article
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

const seedArticles = [
  {
    title: "Welcome Article",
    content: "This article is visible to all authenticated roles.",
    createdBy: "Admin User",
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

    /* Seed users (passwords are auto-hashed by the pre-save hook) */
    const createdUsers = await User.create(seedUsers);
    console.log(`Created ${createdUsers.length} users:`);
    createdUsers.forEach((u) => {
      console.log(`  - ${u.email} (${u.role})`);
    });

    /* Seed articles */
    const createdArticles = await Article.create(seedArticles);
    console.log(`Created ${createdArticles.length} article(s)`);

    console.log("\nSeed complete!");
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
