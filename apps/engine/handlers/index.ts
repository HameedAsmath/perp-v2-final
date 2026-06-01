import type { EngineResponse, ToEngine } from "types";
import { resetAll } from "../state/reset";
import { createUser, getBalanceView } from "../state/users";
import { placeOrder } from "../state/orderbook";

export async function dispatch(
  message: ToEngine & { correlationId: string },
): Promise<EngineResponse> {
  switch (message.messageType) {
    case "reset":
      resetAll();
      return {
        ok: true,
        data: { ok: true },
      };
    case "create_user":
      createUser(message.userId, Number(message.initialBalance));
      return {
        ok: true,
        data: { ok: true, userId: message.userId },
      };
    case "place_order":
      return {
        ok: true,
        data: placeOrder({
          userId: message.userId,
          symbol: message.symbol,
          side: message.side,
          type: message.type,
          quantity: Number(message.quantity),
          price: Number(message.price),
          leverage: Number(message.leverage),
          postOnly: message.postOnly === "true",
        }),
      };
    case "get_balance":
      return {
        ok: true,
        data: getBalanceView(message.userId),
      };
    default:
      return {
        ok: false,
        error: `Unknown messageType: ${message.messageType}`,
      };
  }
}
