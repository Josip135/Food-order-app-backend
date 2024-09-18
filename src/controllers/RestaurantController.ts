import { Request, Response } from "express";
import Restoran from "../models/restaurant";

/*const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restoran.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};*/

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const grad = req.params.grad;

    const searchQuery = (req.query.searchQuery as string) || "";
    const odabranaVrstaJela = (req.query.odabranaVrstaJela as string) || "";
    const sortOption = (req.query.sortOption as string) || "zadnjiUpdate";
    const stranica = parseInt(req.query.stranica as string) || 1;

    let query: any = {};

    query["grad"] = new RegExp(grad, "i");
    const provjeraGrada = await Restoran.countDocuments(query)
    if (provjeraGrada === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          stranica: 1,
          stranice: 1,
        }
      });
    }

    if (odabranaVrstaJela) {
      //URL = odabranaVrstaJela = Burgeri, BBQ, Pizza
      const vrsteJelaArray = odabranaVrstaJela.split(",").map((vrstaJela) => new RegExp(vrstaJela, "i"));

      query["vrsteJela"] = { $all: vrsteJelaArray };
    }

    if (searchQuery) {
      //imeRestorana = Plan B
      //vrsteJela = [Pizza, Burgeri, BBQ]
      //searchQuery = Burgeri
      const searchRegex = new RegExp(searchQuery, "i");

      query["$or"] = [
        { imeRestorana: searchRegex },
        { vrsteJela: { $in: [searchRegex] } },
      ];
    }

    const velicinaStranice = 10;
    const skip = (stranica - 1) * velicinaStranice;

    const restorani = await Restoran.find(query).sort({ [sortOption]: 1 }).skip(skip).limit(velicinaStranice).lean();

    const total = await Restoran.countDocuments(query);

    const response = {
      data: restorani,
      pagination: {
        total,
        stranica,
        stranice: Math.ceil(total / velicinaStranice), //50 rezultata, velicina stranice = 10 -> stranice = 5
      }
    };

    res.json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Nešto je pošlo po krivu!" });
  }
};

export default {
  searchRestaurant,

}