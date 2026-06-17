import { getPositionEquityTotals } from "./positions";
import { getMarkPrice } from "./markPrices";

export type UserAccount = {
  availableBalance: number;
  lockedMargin: number;
  realizedPnl: number;
};
const users = new Map<string, UserAccount>();

export function resetUsers() {
  users.clear();
}

export function createUser(userId: string, initialBalance: number) {
  users.set(userId, {
    availableBalance: initialBalance,
    lockedMargin: 0,
    realizedPnl: 0,
  });
}

export function getUser(userId: string) {
  const user = users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export function getBalanceView(userId: string) {
  const user = getUser(userId);
  const { positionMargin, unrealizedPnl } = getPositionEquityTotals(
    userId,
    getMarkPrice,
  );
  const totalEquity =
    user.availableBalance + user.lockedMargin + positionMargin + unrealizedPnl;

  return {
    userId,
    availableBalance: user.availableBalance,
    lockedMargin: user.lockedMargin,
    realizedPnl: user.realizedPnl,
    totalEquity,
  };
}

// helper
export function requiredMargin(price: number, qty: number, leverage: number) {
  return (price * qty) / leverage;
}

export function exportUsers(): Record<string, UserAccount> {
  return Object.fromEntries(users);
}
export function importUsers(data: Record<string, UserAccount>) {
  users.clear();
  for (const [id, account] of Object.entries(data)) {
    users.set(id, account);
  }
}
