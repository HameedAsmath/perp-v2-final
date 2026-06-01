import { consumer } from "./client";
import { completePending } from "./loopback";

const GROUP = "backend";
const CONSUMER = "backend1";
const STREAM = "to-backend";

async function ensureGroup() {
  try {
    await consumer.xGroupCreate(STREAM, GROUP, "$", { MKSTREAM: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("BUSYGROUP")) {
      // if the group already exists, we don't need to throe an error
      return;
    }
    throw error;
  }
}
export async function startBackendConsumer() {
  await ensureGroup();

  while (true) {
    const response = await consumer.xReadGroup(
      GROUP,
      CONSUMER,
      {
        key: STREAM,
        id: ">", // only new messages
      },
      {
        BLOCK: 1000,
        COUNT: 1,
      },
    );
    if (!response) {
      console.log("no reponse in backend");
      continue;
    }
    console.log("response in backend", response[0]?.messages[0]?.message);
    for (const batch of response) {
      // incase of many streams
      for (const messages of batch.messages) {
        const message = messages.message;
        const { correlationId, response } = message; // get the response and resolve the promise acknowledge the mesaage
        if (response) {
          completePending(correlationId, response);
        }

        await consumer.xAck(STREAM, GROUP, messages.id); // if not acknowledged it will replay from the start incase of failure
      }
    }
  }
}
