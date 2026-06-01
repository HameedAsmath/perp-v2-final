import { Router } from "express";
import {
  createUser,
  placeOrder,
  resetExchange,
  getUserBalance,
  getUserPositions,
  applyFunding,
  updateMarkPrice,
  getInsuranceFund,
  getAdlEvents,
} from "../controllers/exchange.controller";

const exchangeRouter = Router();

exchangeRouter.post("/reset", resetExchange);
exchangeRouter.post("/users", createUser);
exchangeRouter.post("/orders", placeOrder);
exchangeRouter.get("/users/:userId/balance", getUserBalance);
exchangeRouter.get("/users/:userId/positions", getUserPositions);
exchangeRouter.post("/mark-price", updateMarkPrice);
exchangeRouter.post("/funding", applyFunding);
exchangeRouter.get("/insurance-fund/:symbol", getInsuranceFund);
exchangeRouter.get("/adl-events", getAdlEvents);

export default exchangeRouter;
