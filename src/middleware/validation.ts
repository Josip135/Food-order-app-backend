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