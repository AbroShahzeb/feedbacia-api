import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, slogan, description, tags, admin } = req.body;

  const newProduct = await Product.create({
    name,
    slogan,
    description,
    tags,
    admin,
  });

  res.status(200).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

export const getProductByAdmin = catchAsync(async (req, res, next) => {
  const { adminId } = req.query;
  const product = await Product.findOne({ admin: adminId }).populate("admin");

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate("admin");
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});
