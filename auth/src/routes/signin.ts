import {
  BadRequestError,
  validateRequest,
} from "@thongphamvn/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const validPass = await Password.compare(user.password, password);
    if (!validPass) {
      throw new BadRequestError("Invalid email or password");
    }

    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };
    res.status(200).send(user);
  }
);

export { router as signInRouter };
