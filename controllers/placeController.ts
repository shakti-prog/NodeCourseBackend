import { Request, Response, Router } from "express";
import { Places } from "../interfaces/interfaces";
import * as uuid from "uuid";
const createCustomError = require("../functions/Errorfunctions/index");
import { validationResult } from "express-validator";
const handlerFunctions = require("../db/HandlerFunctions");
import * as mongoDB from "mongodb";

// const dummyPlacesData: Array<Places> = [
//   {
//     id: "pd1",
//     title: "test_one",
//     description: "test description",
//     coordinates: {
//       latitude: 40.78,
//       longitude: -74.5,
//     },
//     address: "Test address",
//     creator: "Test_creator",
//     image: "http://action.example.com/",
//   },
//   {
//     id: "pd2",
//     title: "test_two",
//     description: "test description",
//     coordinates: {
//       latitude: 40.78,
//       longitude: -74.5,
//     },
//     address: "Test two address",
//     creator: "Test two creator",
//     image: "http://action.example.com/",
//   },
// ];

async function getPlaceById(req: Request, res: Response, next: Function) {
  console.log("Get request");
  const placeId: string = req.params.placeId;
  const places: Array<Places> = await handlerFunctions.getQuery("Places", {
    id: placeId,
  });
  if (!places || places.length === 0)
    return next(createCustomError("No place found for place id", 404));
  res.json({ places });
}

async function getPlaceByUserId(req: Request, res: Response, next: Function) {
  console.log("Place for user");
  const userId: string = req.params.userId;
  const places: Array<Places> = await handlerFunctions.getQuery("Places", {
    creator: userId,
  });
  if (!places || places.length === 0)
    return next(createCustomError("No place found for place id", 404));
  res.json({ places });
}

async function createPlace(req: Request, res: Response, next: Function) {
  console.log("Here in creation of place");
  if (!validationResult(req).isEmpty())
    return next(createCustomError("Validation error", 422));
  const requestBody: Places = req.body;
  const { description, title, coordinates, address, creator, image } =
    requestBody;
  const newObject: Places = {
    description,
    title,
    coordinates,
    address,
    creator,
    id: uuid.v4(),
    image,
  };
  const response: mongoDB.InsertOneResult =
    await handlerFunctions.insertOneQuery("Places", newObject);
  res.status(201).json(response);
}

async function updatePlace(req: Request, res: Response, next: Function) {
  console.log("in update place");
  // if (!validationResult(req).isEmpty())
  //   return next(createCustomError("Validation error", 422));
  // const placeId: string = req.params.placeId;
  // const indexNum: number = dummyPlacesData.findIndex((d) => d.id === placeId);
  // if (indexNum < 0) {
  //   return next(createCustomError("No place found with given id", 404));
  // }
  // const updatedObject: Places = req.body;
  // const currObject: Places = dummyPlacesData[indexNum];
  // dummyPlacesData[indexNum] = { ...currObject, ...updatedObject };
  // res.status(201).json(dummyPlacesData[indexNum]);
}

async function deletePlace(req: Request, res: Response, next: Function) {
  console.log("In in delete place");
  // const placeId: string = req.params.placeId;
  // const newDummyData: Array<Places> = dummyPlacesData.filter(
  //   (d) => d.id !== placeId
  // );
  // res.status(201).json(newDummyData);
}
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
