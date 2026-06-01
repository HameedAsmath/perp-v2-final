export type UserAccount = {
  availableBalance: number;
  lockedMargin: number;
  realizedPnl: number;
};

export type ExchangeState = {
  users: Map<string, UserAccount>;
};

let state: ExchangeState = createEmptyState();

export function resetExchange() {
  state = createEmptyState();
}

function createEmptyState(): ExchangeState {
  return {
    users: new Map(),
  };
}

export function createUser(userId: string, initialBalance: number) {
  state.users.set(userId, {
    availableBalance: initialBalance,
    lockedMargin: 0,
    realizedPnl: 0,
  });
}

export function getBalance(userId: string) {
  const user = state.users.get(userId);
  if (!user) throw new Error("User not found");

  return {
    userId,
    availableBalance: user.availableBalance,
    lockedMargin: user.lockedMargin,
    realizedPnl: user.realizedPnl,
    totalEquity: user.availableBalance + user.lockedMargin + user.realizedPnl,
  };
}
