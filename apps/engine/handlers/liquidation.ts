import { getMarkPrice } from "../state/markPrices";
import { getAllPositionsForSymbol } from "../state/positions";
import type { Position } from "../state/positions";
import { runAdl } from "../handlers/adl";

const MAINTENANCE_MARGIN_RATE = 0.005;

export type LiquidationEvent = {
  userId: string;
  symbol: string;
  reason: string;
};

function liquidationPrice(position: Position): number {
  const entry = position.averageEntryPrice;
  const lev = position.leverage;
  if (position.side === "long") {
    // long dies when mark falls to this level
    return entry * (1 - 1 / lev + MAINTENANCE_MARGIN_RATE);
  }
  // short dies when mark rises to this level
  return entry * (1 + 1 / lev - MAINTENANCE_MARGIN_RATE);
}

function shouldLiquidate(
  side: "long" | "short",
  markPrice: number,
  liqPrice: number,
): boolean {
  if (side === "long") return markPrice <= liqPrice;
  return markPrice >= liqPrice;
}

import { getUser } from "../state/users";
import { removePosition } from "../state/positions";
import { debitInsurance } from "../state/insurance";
// keep your existing imports...

function liquidateUserPosition(
  userId: string,
  position: Position,
  mark: number,
): void {
  const user = getUser(userId);

  // PnL if we close at mark
  const pnl =
    position.side === "long"
      ? (mark - position.averageEntryPrice) * position.quantity
      : (position.averageEntryPrice - mark) * position.quantity;

  const settlement = position.margin + pnl;
  removePosition(userId, position.symbol); // Remove open position
  user.realizedPnl += pnl; // Return position collateral + PnL to wallet

  if (settlement >= 0) {
    user.availableBalance += settlement; // Healthy liquidation: user keeps proceeds
    return;
  }
  // Bankrupt: user cannot go negative
  const deficit = -settlement;
  user.availableBalance = Math.max(0, user.availableBalance + settlement);
  const shortfall = debitInsurance(position.symbol, deficit);
  if (shortfall > 0) {
    runAdl(position.symbol, shortfall, mark, position.side);
  }
}

export function runLiquidations(symbol: string): LiquidationEvent[] {
  const mark = getMarkPrice(symbol);
  const events: LiquidationEvent[] = [];
  // Loop every open position for this symbol (you need getAllPositionsForSymbol(symbol))
  for (const { userId, position } of getAllPositionsForSymbol(symbol)) {
    const liq = liquidationPrice(position);
    if (!shouldLiquidate(position.side, mark, liq)) continue;
    // Close position: release margin, realize PnL at mark, clear position
    liquidateUserPosition(userId, position, mark);
    events.push({
      userId,
      symbol,
      reason: "maintenance_margin",
    });
  }
  return events;
}
