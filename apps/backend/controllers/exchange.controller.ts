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

export async function placeOrder(req: Request, res: Response) {
  const { userId, symbol, side, type, quantity, price, leverage, postOnly } =
    req.body;
  try {
    const data = await loopback({
      messageType: "place_order",
      userId,
      symbol,
      side,
      type,
      quantity: String(quantity),
      price: String(price ?? 0),
      leverage: String(leverage ?? 1),
      postOnly: String(postOnly ?? false),
    });
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to place order" });
  }
}

export async function getUserBalance(req: Request, res: Response) {
  const userId = req.params.userId as string;
  try {
    const data = await loopback({
      messageType: "get_balance",
      userId,
    });
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to get user balance" });
  }
}

export async function getUserPositions(req: Request, res: Response) {
  const userId = req.params.userId as string;
  try {
    const data = await loopback({
      messageType: "get_positions",
      userId,
    });
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to get user positions" });
  }
}

export async function updateMarkPrice(req: Request, res: Response) {
  const { symbol, markPrice, timestamp, runLiquidation } = req.body;
  try {
    const data = await loopback({
      messageType: "update_mark_price",
      symbol,
      markPrice: String(markPrice),
      timestamp: String(timestamp ?? Date.now()),
      runLiquidation: String(runLiquidation ?? true),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to update mark price",
    });
  }
}

export async function applyFunding(req: Request, res: Response) {
  const { symbol, rate, timestamp, runLiquidation } = req.body;
  try {
    const data = await loopback({
      messageType: "apply_funding",
      symbol,
      rate: String(rate),
      timestamp: String(timestamp ?? Date.now()),
      runLiquidation: String(runLiquidation ?? true),
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to apply funding",
    });
  }
}

export async function getInsuranceFund(req: Request, res: Response) {
  try {
    const data = await loopback({
      messageType: "get_insurance_fund",
      symbol: req.params.symbol as string,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to get insurance fund" });
  }
}

export async function getAdlEvents(_req: Request, res: Response) {
  try {
    const data = await loopback({ messageType: "get_adl_events" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to get ADL events" });
  }
}

export async function getOrderBook(req: Request, res: Response) {
  const symbol = req.params.symbol as string;
  try {
    const data = await loopback({
      messageType: "get_orderbook",
      symbol,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to get orderbook",
    });
  }
}
