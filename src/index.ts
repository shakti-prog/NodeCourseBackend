import express, { Express, Request, Response, Router } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { CustomError } from "../interfaces/interfaces";

const placeRoutes: Router = require("../routes/placesRoutes");
const userRoutes: Router = require("../routes/userRoutes");

const createCustomError = require("../functions/Errorfunctions/index");

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use("/api/place", placeRoutes);
app.use("/api/user", userRoutes);
app.use((req: Request, res: Response, next) => {
  return next(createCustomError("Could not find route", 404));
});
app.use((error: CustomError, req: Request, res: Response, next: Function) => {
  if (res.headersSent) {
    return next(error);
  }
  const statusCode: number = error.code || 500;
  res
    .status(statusCode)
    .json({ message: error.message || "Unknown error occured" });
});

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port number ${port}`);
});
