import express, { Router } from "express";
import { check } from "express-validator";

const router: Router = express.Router();

const placeControllers = require("../controllers/placeController");

router.get("/:placeId", placeControllers.getPlaceById);

router.patch(
  "/:placeId",
  [check("title").not().notEmpty(), check("description").isLength({ min: 5 })],
  placeControllers.updatePlace
);

router.delete("/:placeId", placeControllers.deletePlace);

router.get("/user/:userId", placeControllers.getPlaceByUserId);

router.post(
  "/",
  [
    check("title").not().notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().notEmpty(),
  ],
  placeControllers.createPlace
);

module.exports = router;
