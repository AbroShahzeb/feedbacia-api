import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  slogan: String,
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  tags: [
    {
      type: String,
      required: "Product feedback tag is required",
    },
  ],
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
