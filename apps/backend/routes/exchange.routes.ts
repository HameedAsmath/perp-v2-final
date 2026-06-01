import { Router } from "express";
import {
  createUser,
  placeOrder,
  resetExchange,
  getUserBalance,
} from "../controllers/exchange.controller";

const exchangeRouter = Router();

exchangeRouter.post("/reset", resetExchange);
exchangeRouter.post("/users", createUser);
exchangeRouter.post("/orders", placeOrder);
exchangeRouter.get("/users/:userId/balance", getUserBalance);

export default exchangeRouter;
