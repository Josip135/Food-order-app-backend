import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1025 //5mb
  }
});

router.get("/narudzba", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurantOrders)

//update status of the order
router.patch("/narudzba/:narudzbaId/status", jwtCheck, jwtParse, MyRestaurantController.updateStatusNarudzbe);

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant)

// /api/my/restaurant
router.post("/", upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.createMyRestaurant);

//put is for updating entire entity
router.put("/", upload.single("imageFile"), validateMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.updateMyRestaurant);

export default router;