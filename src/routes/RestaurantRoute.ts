import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get("/:restoranId", param("restoranId").isString().trim().notEmpty().withMessage("Parametar ID-a restorana mora biti validan string!"), RestaurantController.getRestaurant)

router.get("/search/:grad", param("grad").isString().trim().notEmpty().withMessage("Parametar grada mora biti validan string!"),
  RestaurantController.searchRestaurant
);


export default router;