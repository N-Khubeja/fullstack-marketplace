// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   }
// });

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    subcategory: {
      type: String,
      required:true,
      trim: true,
      default: null
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },


attributes: {
  type: Map,
  of: mongoose.Schema.Types.Mixed,
  default: {}
},

    images: [
      {
        url: {
          type: String,
          required: true
        },

        publicId: {
          type: String,
          default: null
        }
      }
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  "Product",
  productSchema
)