import type { EngineResponse, ToEngine } from "types";
import { resetAll } from "../state/reset";
import { createUser } from "../state/users";

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
    default:
      return {
        ok: false,
        error: `Unknown messageType: ${message.messageType}`,
      };
  }
}
