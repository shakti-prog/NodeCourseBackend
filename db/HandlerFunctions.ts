import {
  DocumentStructure,
  Places,
  UserDetails,
} from "../interfaces/interfaces";
import * as mongoDB from "mongodb";

const client = require("./Client");

async function getQuery(
  collectionName: string,
  filters: DocumentStructure,
  projection = {}
) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const res: Array<DocumentStructure> = await db
      .collection(collectionName)
      .find(filters)
      .project(projection)
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

async function updateOneQuery(
  collectionName: string,
  filter: DocumentStructure,
  updates: DocumentStructure
) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const res: mongoDB.UpdateResult = await db
      .collection(collectionName)
      .updateOne(filter, updates);
    await client.close();
    return res;
  } catch (e) {
    console.error(e);
    await client.close();
  }
}

async function placeAdditionTransaction(place: Places, creator: string) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const session: mongoDB.ClientSession = client.startSession();
    session.startTransaction();
    try {
      const newPlace: mongoDB.InsertOneResult = await db
        .collection("Places")
        .insertOne(place);
      const placeId: mongoDB.ObjectId = newPlace.insertedId;
      await db
        .collection<UserDetails>("Users")
        .updateOne({ name: creator }, { $push: { places: placeId } });
      await session.commitTransaction();
      console.log("Transaction commited");
    } catch (e) {
      console.log("transaction aborted");
      console.error(e);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function placeDeletionTransaction(
  placeId: mongoDB.ObjectId,
  creator: string
) {
  try {
    await client.connect();
    const db: mongoDB.Db = client.db();
    const session: mongoDB.ClientSession = client.startSession();
    session.startTransaction();
    try {
      await db.collection("Places").deleteOne({ _id: placeId });
      await db
        .collection<UserDetails>("Users")
        .updateOne({ name: creator }, { $pull: { places: placeId } });
      await session.commitTransaction();
      console.log("Transaction commited");
    } catch (e) {
      console.log("transaction aborted");
      console.error(e);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

exports.insertOneQuery = insertOneQuery;
exports.deleteOneQuery = deleteOneQuery;
exports.getQuery = getQuery;
exports.updateOneQuery = updateOneQuery;
exports.placeAdditionTransaction = placeAdditionTransaction;
exports.placeDeletionTransaction = placeDeletionTransaction;
