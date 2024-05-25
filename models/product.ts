import { Schema, model, connect } from "mongoose";
import { Product } from "../interfaces/interfaces";

const productSchema = new Schema<Product>({
  productName: { type: String, required: true },
  productId: { type: String, required: true },
  productDescription: { type: String, required: true },
  price: { type: Number, required: true },
});

const productModel = model<Product>("Product", productSchema);

module.exports = productModel;
