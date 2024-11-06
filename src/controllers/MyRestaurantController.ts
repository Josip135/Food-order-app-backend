import { Request, Response } from "express";
import Restoran from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Narudzba from "../models/order";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {

    const restoran = await Restoran.findOne({ user: req.userId });

    if (!restoran) {
      return res.status(404).json({ message: "Restoran nije pronađen!" });
    }
    res.json(restoran);

  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Greška u dohvaćanju restorana!" })
  }
}

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const postojeciRestoran = await Restoran.findOne({ user: req.userId });

    if (postojeciRestoran) {
      return res.status(409).json({ message: "Korisnički restoran već postoji!" });
    }

    //const slika = req.file as Express.Multer.File;

    //const base64Slika = Buffer.from(slika.buffer).toString("base64");
    //const dataURI = `data:${slika.mimetype};base64,${base64Slika}`;

    //const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    const url_slike = await dodajSliku(req.file as Express.Multer.File);

    const restoran = new Restoran(req.body);
    restoran.urlSlike = url_slike;
    restoran.user = new mongoose.Types.ObjectId(req.userId);
    restoran.zadnjiUpdate = new Date();

    await restoran.save();

    res.status(201).send(restoran);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: " Nešto je pošlo po krivu!" });
  }
}

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {

    const restoran = await Restoran.findOne({ user: req.userId, });

    if (!restoran) {
      return res.status(404).json({ message: "Restoran nije pronađen!" });
    }

    restoran.imeRestorana = req.body.imeRestorana;
    restoran.grad = req.body.grad;
    restoran.drzava = req.body.drzava;
    restoran.cijenaDostave = req.body.cijenaDostave;
    restoran.procijenjenoVrijemeDostave = req.body.procijenjenoVrijemeDostave;
    restoran.vrsteJela = req.body.vrsteJela;
    restoran.jelovnik = req.body.jelovnik;
    restoran.zadnjiUpdate = new Date();

    if (req.file) {
      const url_slike = await dodajSliku(req.file as Express.Multer.File);
      restoran.urlSlike = url_slike;
    }

    await restoran.save();
    res.status(200).send(restoran);

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: " Nešto je pošlo po krivu!" });
  }
}

const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restoran = await Restoran.findOne({ user: req.userId });
    if (!restoran) {
      return res.status(404).json({ message: "Restoran nije pronađen!" });
    }

    const narudzbe = await Narudzba.find({ restoran: restoran._id }).populate("restoran").populate("user");

    res.json(narudzbe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Nešto je pošlo po krivu!" });
  }
}

const updateStatusNarudzbe = async (req: Request, res: Response) => {
  try {
    const { narudzbaId } = req.params;
    const { status } = req.body;

    const narudzba = await Narudzba.findById(narudzbaId);
    if (!narudzba) {
      return res.status(404).json({ message: "Narudžba nije pronađena!" });
    }

    const restoran = await Restoran.findById(narudzba.restoran);

    if (restoran?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    narudzba.status = status;
    await narudzba.save();
    res.status(200).json(narudzba);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Nemoguće promijeniti status narudžbe!" })
  }
}

const dodajSliku = async (file: Express.Multer.File) => {
  const slika = file;

  const base64Slika = Buffer.from(slika.buffer).toString("base64");
  const dataURI = `data:${slika.mimetype};base64,${base64Slika}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

  return uploadResponse.url;
}


export default {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateStatusNarudzbe
};