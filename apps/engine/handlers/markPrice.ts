import { setMarkPrice } from "../state/markPrices";
import { runLiquidations, type LiquidationEvent } from "./liquidation";

export type MarkPriceResult = {
  symbol: string;
  markPrice: number;
  liquidations: LiquidationEvent[];
};

export async function updateMarkPrice(
  symbol: string,
  markPrice: number,
  runLiquidation: boolean,
): Promise<MarkPriceResult> {
  setMarkPrice(symbol, markPrice);

  const liquidations = runLiquidation ? await runLiquidations(symbol) : [];

  return { symbol, markPrice, liquidations };
}
