import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const trenutniKorisnik = await User.findOne({ _id: req.userId });

    if (!trenutniKorisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen!" });
    }

    res.json(trenutniKorisnik);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Nastala je greška!" });
  }
};

const createCurrentuser = async (req: Request, res: Response) => {

  try {
    //1. potrebno provjeriti postoji li korisnik
    const { auth0Id } = req.body;
    const postojeciKorisnik = await User.findOne({ auth0Id });

    if (postojeciKorisnik) {
      return res.status(200).send();
    }

    //2. Stvoriti korisnika ako ne postoji
    const noviKorisnik = new User(req.body);
    await noviKorisnik.save();

    //3. Vratiti objekt "User" pozvanom klijentu
    res.status(201).json(noviKorisnik.toObject());
    //console.log(noviKorisnik);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Greška pri stvaranju korisnika!" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { ime, adresa, grad, drzava } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Korisnik nije pronađen u bazi!" });
    }

    user.ime = ime;
    user.adresa = adresa;
    user.grad = grad;
    user.drzava = drzava;

    await user.save();

    res.send(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Greška pri izmijeni podataka korisnika!" });
  }
}

export default {
  getCurrentUser,
  createCurrentuser,
  updateCurrentUser,

};