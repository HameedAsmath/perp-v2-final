import { SNAPSHOT_VERSION, type EngineSnapshot } from "./types";
import { exportUsers, importUsers } from "../state/users";
import { exportPositions, importPositions } from "../state/positions";
import { exportOrderbook, importOrderbook } from "../state/orderbook";

export function buildSnapshot(): EngineSnapshot {
  return {
    version: SNAPSHOT_VERSION,
    createdAt: new Date().toISOString(),
    users: exportUsers(),
    positions: exportPositions(),
    orderbook: exportOrderbook(),
  };
}

export function restoreSnapshot(snapshot: EngineSnapshot) {
  importUsers(snapshot.users);
  importPositions(snapshot.positions);
  importOrderbook(snapshot.orderbook);
}

const SNAPSHOT_PATH =
  process.env.SNAPSHOT_PATH ?? "./data/snapshots/latest.json";

export function startSnapshotScheduler(intervalMs = 10 * 60 * 1000) {
  setInterval(async () => {
    try {
      await Bun.write(SNAPSHOT_PATH, JSON.stringify(buildSnapshot()));
      console.log("snapshot saved");
    } catch (err) {
      console.error("snapshot failed", err);
    }
  }, intervalMs);
}

export async function loadSnapshot(): Promise<EngineSnapshot | null> {
  const file = Bun.file(SNAPSHOT_PATH);
  if (!(await file.exists())) return null;
  return (await file.json()) as EngineSnapshot;
}
