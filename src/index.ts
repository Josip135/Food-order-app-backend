import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import { v2 as cloudinary } from "cloudinary";
import RestaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

dotenv.config();
mongoose.connect(process.env.MONGODB_CONNECTION as string).then(() => console.log("Successfully connected to database!"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
//app.use(express.json());
app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoute);

app.use("/api/my/restaurant", myRestaurantRoute);

app.use("/api/restaurant", RestaurantRoute);

app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});