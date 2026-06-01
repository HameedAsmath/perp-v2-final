import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const reader = createClient({ url: REDIS_URL });
export const publisher = createClient({ url: REDIS_URL });
