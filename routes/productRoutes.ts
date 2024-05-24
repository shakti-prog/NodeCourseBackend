import express, { Router } from "express";

const router: Router = express.Router();

const productControllers = require("../controllers/productController");

router.get("/:productId", productControllers.getProduct);

router.patch("/:productId", productControllers.updateProduct);

router.delete("/:placeId", productControllers.deleteProduct);

router.post("/", productControllers.createProduct);

module.exports = router;
