import { Request, Response, Router } from "express";
import { Places } from "../interfaces/interfaces";
import * as uuid from "uuid";
const createCustomError = require("../functions/Errorfunctions/index");
import { validationResult } from "express-validator";

const dummyPlacesData: Array<Places> = [
  {
    id: "pd1",
    title: "test_one",
    description: "test description",
    coordinates: {
      latitude: 40.78,
      longitude: -74.5,
    },
    address: "Test address",
    creator: "Test_creator",
  },
  {
    id: "pd2",
    title: "test_two",
    description: "test description",
    coordinates: {
      latitude: 40.78,
      longitude: -74.5,
    },
    address: "Test two address",
    creator: "Test two creator",
  },
];

function getPlaceById(req: Request, res: Response, next: Function) {
  console.log("Get request");
  const placeId: string = req.params.placeId;
  const place = dummyPlacesData.find((p) => p.id === placeId);
  if (!place) {
    return next(createCustomError("No place found with place id", 404));
  }
  return res.json({ place });
}

function getPlaceByUserId(req: Request, res: Response, next: Function) {
  console.log("Place for user");
  const userId: string = req.params.userId;
  const place: Array<Places> = dummyPlacesData.filter(
    (p) => p.creator === userId
  );
  if (!place || place.length === 0) {
    return next(createCustomError("No place found for user id", 404));
  }
  res.json({ place });
}

function createPlace(req: Request, res: Response, next: Function) {
  console.log("Here in creation of place");
  if (!validationResult(req).isEmpty())
    return next(createCustomError("Validation error", 422));
  const requestBody: Places = req.body;
  const { description, title, coordinates, address, creator } = requestBody;
  const newObject: Places = {
    description,
    title,
    coordinates,
    address,
    creator,
    id: uuid.v4(),
  };
  dummyPlacesData.push(newObject);
  res.status(201).json(newObject);
}

function updatePlace(req: Request, res: Response, next: Function) {
  console.log("in update place");
  if (!validationResult(req).isEmpty())
    return next(createCustomError("Validation error", 422));
  const placeId: string = req.params.placeId;
  const indexNum: number = dummyPlacesData.findIndex((d) => d.id === placeId);
  if (indexNum < 0) {
    return next(createCustomError("No place found with given id", 404));
  }
  const updatedObject: Places = req.body;
  const currObject: Places = dummyPlacesData[indexNum];
  dummyPlacesData[indexNum] = { ...currObject, ...updatedObject };
  res.status(201).json(dummyPlacesData[indexNum]);
}

function deletePlace(req: Request, res: Response, next: Function) {
  console.log("In in delete place");
  const placeId: string = req.params.placeId;
  const newDummyData: Array<Places> = dummyPlacesData.filter(
    (d) => d.id !== placeId
  );
  res.status(201).json(newDummyData);
}
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
