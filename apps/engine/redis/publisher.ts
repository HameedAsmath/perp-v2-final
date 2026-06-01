import type { EngineResponse } from "types";
import { publisher } from "./client";

export async function reply(correlationId: string, result: EngineResponse) {
  await publisher.xAdd("to-backend", "*", {
    correlationId,
    response: JSON.stringify(result),
  });
}
