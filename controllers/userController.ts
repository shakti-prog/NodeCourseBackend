import express, { Request, Response, Router } from "express";
import { UserDetails } from "../interfaces/interfaces";

const createCustomError = require("../functions/Errorfunctions/index");
import { validationResult } from "express-validator";

const dummyUser: Array<UserDetails> = [
  {
    id: "id1",
    name: "UserOne",
    email: "userOne@gmail.com",
    password: "shakti02",
  },
  {
    id: "id2",
    name: "UserTwo",
    email: "userTwo@gmail.com",
    password: "shakti02",
  },
];

function getAllUsers(req: Request, res: Response, next: Function) {
  console.log("In user router");
  res.json({ users: dummyUser });
}

function signUp(req: Request, res: Response, next: Function) {
  if (!validationResult(req).isEmpty())
    return next(createCustomError("Invalid signup details", 422));
  const requestBody: UserDetails = req.body;
  const email: string = requestBody.email;
  const user: UserDetails | undefined = dummyUser.find(
    (d) => d.email === email
  );
  if (user) {
    return next(createCustomError("User with this email already exists", 400));
  }
  res.json({ message: "User successfully created" });
}

function login(req: Request, res: Response, next: Function) {
  const requestBody: UserDetails = req.body;
  const email: string = requestBody.email;
  const user: UserDetails | undefined = dummyUser.find(
    (d) => d.email === email
  );
  if (!user) {
    return next(
      createCustomError("User with this email not found please sign up", 404)
    );
  }
  if (user.password !== requestBody.password) {
    return next(createCustomError("Wrong password", 400));
  }
  res.json({ message: "User successfully logged in" });
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
