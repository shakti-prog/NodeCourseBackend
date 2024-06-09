import { Request, Response, Router } from "express";
import {
  DocumentStructure,
  Places,
  UserDetails,
} from "../interfaces/interfaces";
import * as uuid from "uuid";
const createCustomError = require("../functions/Errorfunctions/index");
import { validationResult } from "express-validator";
const handlerFunctions = require("../db/HandlerFunctions");
import * as mongoDB from "mongodb";

async function getPlaceById(req: Request, res: Response, next: Function) {
  console.log("Get request");
  try {
    const placeId: string = req.params.placeId;
    const places: Array<Places> = await handlerFunctions.getQuery("Places", {
      id: placeId,
    });
    if (!places || places.length === 0)
      return next(createCustomError("No place found for place id", 404));
    res.json({ places });
  } catch (error) {
    console.error(error);
    return next(createCustomError("Something went wrong", 500));
  }
}

async function getPlaceByUserId(req: Request, res: Response, next: Function) {
  console.log("Place for user");
  try {
    const userId: string = req.params.userId;
    const places: Array<Places> = await handlerFunctions.getQuery("Places", {
      creator: userId,
    });
    if (!places || places.length === 0)
      return next(createCustomError("No place found for place id", 404));
    res.json({ places });
  } catch (error) {
    console.error(error);
    return next(createCustomError("Something went wrong", 500));
  }
}

async function createPlace(req: Request, res: Response, next: Function) {
  console.log("Here in creation of place");
  try {
    if (!validationResult(req).isEmpty())
      return next(createCustomError("Validation error", 422));
    const requestBody: Places = req.body;
    const { description, title, coordinates, address, creator, image } =
      requestBody;
    const user: Array<UserDetails> = await handlerFunctions.getQuery(
      "Users",
      { name: creator },
      { _id: 1 }
    );
    if (!user || user.length === 0)
      return next(
        createCustomError(
          "Place cannot be created as user with given credentials is not present ",
          401
        )
      );
    await handlerFunctions.placeAdditionTransaction(
      {
        description,
        title,
        coordinates,
        address,
        creator,
        id: uuid.v4(),
        image,
      },
      creator
    );

    res.status(201).json({ message: "Place successfully added" });
  } catch (error) {
    console.error(error);
    return next(createCustomError("Something went wrong", 500));
  }
}

async function updatePlace(req: Request, res: Response, next: Function) {
  console.log("in update place");
  try {
    if (!validationResult(req).isEmpty())
      return next(createCustomError("Validation error", 422));
    const placeId: string = req.params.placeId;
    const updates: Places = req.body;
    const currentPlace: Array<Places> = await handlerFunctions.getQuery(
      "Places",
      {
        id: placeId,
      }
    );
    if (!currentPlace || currentPlace.length === 0)
      return next(createCustomError("Not found", 404));
    const resp: mongoDB.UpdateResult = await handlerFunctions.updateOneQuery(
      "Places",
      { id: placeId },
      { $set: updates }
    );
    return res.status(200).json(resp);
  } catch (error) {
    console.error(error);
    return next(createCustomError("Something went wrong", 500));
  }
}

async function deletePlace(req: Request, res: Response, next: Function) {
  console.log("In in delete place");
  try {
    const placeId: string = req.params.placeId;
    const place: Array<DocumentStructure> = await handlerFunctions.getQuery(
      "Places",
      {
        id: placeId,
      }
    );
    if (!place || place.length === 0)
      return next(createCustomError("No place is present with given id", 404));
    await handlerFunctions.placeDeletionTransaction(
      place[0]._id,
      place[0].creator
    );
    res.status(200).json({ message: "Place Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return next(createCustomError("Something went wrong", 500));
  }
}
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
