import * as mongoDB from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl: string = process.env.mongoUrl || "";

const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongoUrl);

module.exports = client;
