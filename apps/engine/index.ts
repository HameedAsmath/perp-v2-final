// import dotenv from "dotenv";
// import { createClient } from "redis";
// import type { ToEngine } from "types";

// dotenv.config();

// type Balance = {
//   available: number;
//   locked: number;
// };
// const BALANCES = new Map<string, Balance>();

// const client = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });
// const publisher = createClient();

// client.on("error", (err) => console.error("Redis error:", err));
// publisher.on("error", (err) => console.error("Redis error:", err));

// client.connect();
// publisher.connect();

// async function ensureConsumerGroup() {
//   try {
//     await client.xGroupCreate("to-engine", "engine", "$", {
//       MKSTREAM: true, // creates stream if it doeesn't exists
//     });
//   } catch (error: any) {
//     if (!error.message.includes("BUSYGROUP")) {
//       // BUSYGROUP error means the group already exists
//       throw error;
//     }
//   }
// }

// await ensureConsumerGroup();

// while (true) {
//   const response = await client.xReadGroup(
//     "engine", // consumer group name
//     "engine", // consumer name (in this case one one consumer so can be of same name)
//     {
//       key: "to-engine",
//       id: ">",
//     },
//     {
//       BLOCK: 500,
//       COUNT: 1,
//     },
//   );
//   if (!response) {
//     console.log("no response");
//     continue;
//   }
//   const message: { correlationId: string } & ToEngine =
//     response[0]?.messages[0].message;
//   if (message.messageType === "onramp") {
//     const { userId, amount } = message;
//     const balance = BALANCES.get(userId) || { available: 0, locked: 0 };
//     balance.available += Number(amount);
//     BALANCES.set(userId, balance);
//     console.log("balance updated in engine", BALANCES);
//   }
//   if (message.messageType === "create_order") {
//   }
//   publisher.xAdd("to-backend", "*", {
//     correlationId: message.correlationId,
//   });
// }
import { reply } from "./redis/publisher";
import { dispatch } from "./handlers";

const GROUP = "engine";
const CONSUMER = "engine-1";
const STREAM = "to-engine";

await reader.connect();
await publisher.connect();

while (true) {
  const batches = await reader.xReadGroup(
    GROUP,
    CONSUMER,
    {
      key: STREAM,
      id: ">",
    },
    {
      BLOCK: 1000,
      COUNT: 1,
    },
  );
  if (!batches || batches.length === 0) {
    continue;
  }
  for (const batch of batches) {
    for (const messages of batch.messages) {
      const message = messages.message;
      try {
        const result = await dispatch(message);
        await reply(message.correlationId, result);
      } catch (error) {
        await reply(message.correlationId, {
          ok: false,
          error: "failed to dispatch message",
          correlationId: message.correlationId,
        });
      }
      await reader.xAck(STREAM, GROUP, message.id);
    }
  }
}
