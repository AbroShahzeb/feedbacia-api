import express from "express";
import {
  getProductByAdmin,
  getProductById,
} from "../controllers/productController.js";
const router = express.Router();

router.get("/", getProductByAdmin);
router.get("/:productId", getProductById);

export default router;
