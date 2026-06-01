import type { Request, Response } from "express";
import { loopback } from "../redis/loopback";

export async function resetExchange(req: Request, res: Response) {
  try {
    const data = await loopback({ messageType: "reset" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to reset exchange" });
  }
}

export async function createUser(req: Request, res: Response) {
  const { userId, initialBalance } = req.body;
  try {
    const data = await loopback({
      messageType: "create_user",
      userId,
      initialBalance: initialBalance.toString(),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}
