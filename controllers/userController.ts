import { Request, Response, Router } from "express";
import { UserDetails } from "../interfaces/interfaces";
import * as uuid from "uuid";
const createCustomError = require("../functions/Errorfunctions/index");
import { validationResult } from "express-validator";
import { InsertOneResult } from "mongodb";
const handlerFunctions = require("../db/HandlerFunctions");

async function getAllUsers(req: Request, res: Response, next: Function) {
  try {
    const users: Array<UserDetails> = await handlerFunctions.getQuery(
      "Users",
      {},
      { email: 1, name: 1, _id: 0 }
    );
    res.status(200).json({ users });
  } catch (e) {
    console.error(e);
    return next(createCustomError("Something went wrong", 500));
  }
}

async function signUp(req: Request, res: Response, next: Function) {
  try {
    if (!validationResult(req).isEmpty())
      return next(createCustomError("Invalid signup details", 422));
    const requestBody: UserDetails = req.body;
    const email: string = requestBody.email;
    const user: Array<UserDetails> = await handlerFunctions.getQuery("Users", {
      email,
    });
    if (!user || user.length !== 0) {
      return next(
        createCustomError("User with this email already exists", 422)
      );
    }
    const resp: InsertOneResult = await handlerFunctions.insertOneQuery(
      "Users",
      {
        ...requestBody,
        id: uuid.v4(),
        places: [],
      }
    );
    res.status(201).json({ message: "User successfully created", resp });
  } catch (e) {
    console.error(e);
    return next(createCustomError("Something went wrong", 500));
  }
}

async function login(req: Request, res: Response, next: Function) {
  try {
    const requestBody: UserDetails = req.body;
    const email: string = requestBody.email;
    const password: string = requestBody.password;
    const user: Array<UserDetails> = await handlerFunctions.getQuery("Users", {
      email,
      password,
    });
    if (!user || user.length === 0) {
      return next(
        createCustomError(
          "User with this email/password not found please sign up",
          404
        )
      );
    }
    res.status(200).json({ message: "User successfully logged in" });
  } catch (e) {
    console.error(e);
    return next(createCustomError("Something went wrong", 500));
  }
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
