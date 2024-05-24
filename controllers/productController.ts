import { Request, Response } from "express";
import { DocumentStructure } from "../interfaces/interfaces";

const queryFunctions = require("../db/HandlerFunctions");
const createCustomError = require("../functions/Errorfunctions/index");

async function getProduct(req: Request, res: Response, next: Function) {
  try {
    const productId: string = req.params.productId;
    const respone: Array<DocumentStructure> = await queryFunctions.getQuery(
      "products",
      {
        productId,
      }
    );
    if (!respone || respone.length === 0) {
      return next(createCustomError("No product found with this id", 404));
    }
    return res.json({ result: respone });
  } catch (e) {
    return next(createCustomError(e, 501));
  }
}

async function createProduct(req: Request, res: Response, next: Function) {
  try {
    const resp = await queryFunctions.insertOneQuery("products", {
      productName: "prodOne",
      productId: "1234",
    });
    return res.json({ message: "Inserted Successfully", response: resp });
  } catch (e) {
    console.log(e);
    return next(createCustomError(e, 501));
  }
}

async function updateProduct(req: Request, res: Response, next: Function) {}

async function deleteProduct(req: Request, res: Response, next: Function) {}

exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
