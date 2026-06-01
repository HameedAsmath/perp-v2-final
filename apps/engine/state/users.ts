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
  return {
    userId,
    availableBalance: user.availableBalance,
    lockedMargin: user.lockedMargin,
    realizedPnl: user.realizedPnl,
    totalEquity: user.availableBalance + user.lockedMargin + user.realizedPnl,
  };
}

// helper
export function requiredMargin(price: number, qty: number, leverage: number) {
  return (price * qty) / leverage;
}
