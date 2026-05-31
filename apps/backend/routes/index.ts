import { Router } from "express";
import authRoutes from "./auth.routes";
import exchangeRoutes from "./exchange.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/exchange", exchangeRoutes);

export default router;
