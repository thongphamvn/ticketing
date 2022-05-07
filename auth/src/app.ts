import { errorHandler, NotFoundError } from "@thongphamvn/ticketing-common";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signupRouter);
app.use(signoutRouter);

// if no route match above, this cb throw => catch by errorHandler
app.all("*", () => {
  throw new NotFoundError(`Route not found`);
});
app.use(errorHandler);

export { app };
