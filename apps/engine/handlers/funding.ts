import { getAllPositionsForSymbol } from "../state/positions";
import { getUser } from "../state/users";
import { runLiquidations } from "./liquidation";

export type FundingPayment = {
  userId: string;
  side: "long" | "short";
  amount: number; // + receive, − pay
};

export type FundingResult = {
  symbol: string;
  rate: number;
  payments: FundingPayment[];
  liquidations: ReturnType<typeof runLiquidations>;
};

export function applyFunding(
  symbol: string,
  rate: number,
  runLiquidation: boolean,
): FundingResult {
  const payments: FundingPayment[] = [];

  for (const { userId, position } of getAllPositionsForSymbol(symbol)) {
    // assignment: notional = entry * qty (not mark)
    const notional = position.averageEntryPrice * position.quantity;
    let amount = notional * rate;

    // positive rate → longs PAY (negative), shorts RECEIVE (positive)
    if (position.side === "long") amount = -amount;
    // short keeps +amount

    const user = getUser(userId);
    user.availableBalance += amount; // cash flow now
    user.realizedPnl += amount; // show in balance.realizedPnl field

    payments.push({ userId, side: position.side, amount });
  }

  const liquidations = runLiquidation ? runLiquidations(symbol) : [];

  return { symbol, rate, payments, liquidations };
}
