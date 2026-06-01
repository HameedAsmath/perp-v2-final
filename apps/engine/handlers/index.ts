import type { EngineResponse, ToEngine } from "types";
import { resetExchange, createUser } from "../state/exchange";

export async function dispatch(
  message: ToEngine & { correlationId: string },
): Promise<EngineResponse> {
  switch (message.messageType) {
    case "reset":
      resetExchange();
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
    default:
      return {
        ok: false,
        error: `Unknown messageType: ${message.messageType}`,
      };
  }
}
