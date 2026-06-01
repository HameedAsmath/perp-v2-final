import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const producer = createClient({ url: REDIS_URL });
export const consumer = createClient({ url: REDIS_URL });

await producer.connect();
await consumer.connect();
