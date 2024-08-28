import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next();
}

export const validateMyUserRequest = [
  body("ime").isString().notEmpty().withMessage("Ime mora biti u string formatu!"),

  body("adresa").isString().notEmpty().withMessage("Adresa mora biti u string formatu!"),

  body("grad").isString().notEmpty().withMessage("Grad mora biti u string formatu!"),

  body("drzava").isString().notEmpty().withMessage("Drzava mora biti u string formatu!"),

  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("imeRestorana").notEmpty().withMessage("Ime restorana je potreno!"),

  body("grad").notEmpty().withMessage("Grad je potreban!"),

  body("drzava").notEmpty().withMessage("Drzava je potrebna!"),

  body("cijenaDostave").isFloat({ min: 0 }).withMessage("Cijena dostave mora biti pozitivan broj!"),

  body("procijenjenoVrijemeDostave").isInt({ min: 0 }).withMessage("Procijenjeno vrijeme dostave mora biti pozitivan broj!"),

  body("vrsteJela").isArray().withMessage("Vrste jela moraju biti polje ili skup!").not().isEmpty().withMessage("Skup vrsta jela ne smije biti prazan!"),

  //body("jelovnik").isArray().withMessage("Jelovnik mora biti polje ili skup!").not().isEmpty().withMessage("Skup jela na meniju ne smije biti prazan!"),

  body("jelovnik").isArray().withMessage("Jelovnik mora biti polje ili skup!"),

  body("jelovnik.*.ime").notEmpty().withMessage("Ime jela je potrebno"),

  body("jelovnik.*.cijena").isFloat({ min: 0 }).withMessage("Cijena jela je potrebna i mora biti pozitivan broj"),

  handleValidationErrors,
];