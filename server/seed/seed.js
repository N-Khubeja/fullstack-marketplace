require("dotenv").config()

const mongoose = require("mongoose")

const products = require("./products")
const Product = require("../models/Product")
const connectDB = require("../config/db")

async function seedProducts() {
  try {
    await connectDB()

    await Product.deleteMany({})

    await Product.insertMany(products)

    console.log("Products inserted correctly")
  } catch (error) {
    console.error("Seed error:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedProducts()