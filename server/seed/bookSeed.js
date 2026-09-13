import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import Book from "../models/Book.js";
import User from "../models/User.js";

// ==========================================
// Seed Book Data
// ==========================================

const books = [
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "A practical and insightful book about money, behavior, wealth, and financial decision-making.",
    price: 18.99,
    category: "Finance",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
    stock: 25,
    rating: 4.8,
    numReviews: 124,
    isFeatured: true,
  },

  {
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "A practical guide to building better habits and creating lasting positive change.",
    price: 16.99,
    category: "Self Development",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    stock: 30,
    rating: 4.9,
    numReviews: 250,
    isFeatured: true,
  },

  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "A guide to writing readable, maintainable, and professional software code.",
    price: 29.99,
    category: "Programming",
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    stock: 15,
    rating: 4.7,
    numReviews: 98,
    isFeatured: true,
  },

  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A classic American novel exploring ambition, love, wealth, and the American Dream.",
    price: 12.99,
    category: "Classic",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    stock: 20,
    rating: 4.5,
    numReviews: 76,
    isFeatured: false,
  },

  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    description:
      "A personal finance classic focused on financial education, investing, and wealth building.",
    price: 15.99,
    category: "Finance",
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d",
    stock: 22,
    rating: 4.6,
    numReviews: 143,
    isFeatured: true,
  },

  {
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    description:
      "A deep dive into JavaScript fundamentals for developers who want to strengthen their skills.",
    price: 24.99,
    category: "Programming",
    coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    stock: 18,
    rating: 4.8,
    numReviews: 87,
    isFeatured: false,
  },
];

// ==========================================
// Seed Books
// ==========================================

const seedBooks = async () => {
  try {
    // ==========================================
    // Validate Environment Variables
    // ==========================================

    const { MONGODB_URI, ADMIN_EMAIL } = process.env;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (!ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured");
    }

    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();

    // ==========================================
    // Connect to MongoDB
    // ==========================================

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    // ==========================================
    // Find Admin
    // ==========================================

    const admin = await User.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (!admin) {
      throw new Error("Admin not found. Run seedAdmin.js first.");
    }

    // ==========================================
    // Upsert Books
    // ==========================================

    let createdCount = 0;
    let updatedCount = 0;

    for (const book of books) {
      const existingBook = await Book.findOne({
        title: book.title,
        author: book.author,
      });

      if (existingBook) {
        Object.assign(existingBook, {
          ...book,
          createdBy: admin._id,
        });

        await existingBook.save();

        updatedCount++;
      } else {
        await Book.create({
          ...book,
          createdBy: admin._id,
        });

        createdCount++;
      }
    }

    console.log(
      `Books seeded successfully. Created: ${createdCount}, Updated: ${updatedCount}`,
    );

    // ==========================================
    // Disconnect
    // ==========================================

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Book Seed Error:", error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    process.exitCode = 1;
  }
};

seedBooks();
