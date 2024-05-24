import express, { Request, Response, Router } from "express";
import { check } from "express-validator";

const router: Router = express.Router();

const userControllers = require("../controllers/userController");

router.get("/", userControllers.getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  userControllers.signUp
);

router.post("/login", userControllers.login);
module.exports = router;
