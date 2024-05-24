import { DocumentStructure } from "../interfaces/interfaces";
import * as mongoDB from "mongodb";

const client = require("./Client");

async function getQuery(collectionName: string, filters: DocumentStructure) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const res: Array<DocumentStructure> = await db
      .collection(collectionName)
      .find(filters)
      .toArray();
    await client.close();
    return res;
  } catch (e) {
    await client.close();
    throw e;
  }
}

async function insertOneQuery(
  collectionName: string,
  document: DocumentStructure
) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const res: mongoDB.InsertOneResult = await db
      .collection(collectionName)
      .insertOne(document);
    await client.close();
    return res;
  } catch (e) {
    await client.close();
    throw e;
  }
}

async function deleteOneQuery(
  collectionName: string,
  filters: DocumentStructure
) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const res: mongoDB.DeleteResult = await db
      .collection(collectionName)
      .deleteOne(filters);
    await client.close();
    return res;
  } catch (e) {
    await client.close();
  }
}

exports.insertOneQuery = insertOneQuery;
exports.deleteOneQuery = deleteOneQuery;
exports.getQuery = getQuery;
