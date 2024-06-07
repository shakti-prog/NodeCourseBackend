import express, { Router } from "express";
import { check } from "express-validator";

const router: Router = express.Router();

const placeControllers = require("../controllers/placeController");

router.get("/:placeId", placeControllers.getPlaceById);

router.patch(
  "/:placeId",
  [
    check("title").optional().not().notEmpty(),
    check("description").optional().isLength({ min: 5 }),
    check("address").optional().notEmpty(),
    check("image").optional().isURL(),
  ],
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
    check("image").isURL(),
    check("coordinates.latitude").isNumeric(),
    check("coordinates.longitude").isNumeric(),
    check("creator").notEmpty(),
  ],
  placeControllers.createPlace
);

module.exports = router;
