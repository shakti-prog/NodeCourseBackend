import express, { Router } from "express";
import { check } from "express-validator";

const router: Router = express.Router();

const productControllers = require("../controllers/productController");

router.get("/:productId", productControllers.getProduct);

router.patch("/:productId", productControllers.updateProduct);

router.delete("/:placeId", productControllers.deleteProduct);

router.post(
  "/",
  [
    check("productName").isLength({ min: 5 }),
    check("productDescription").isLength({ min: 5 }),
    check("price").isNumeric(),
  ],
  productControllers.createProduct
);

module.exports = router;
