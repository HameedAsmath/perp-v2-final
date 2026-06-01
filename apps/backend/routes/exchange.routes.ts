import { Router } from "express";
import { createUser, resetExchange } from "../controllers/exchange.controller";

const exchangeRouter = Router();

exchangeRouter.post("/reset", resetExchange);
exchangeRouter.post("/users", createUser);

export default exchangeRouter;
