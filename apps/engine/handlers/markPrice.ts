import { setMarkPrice } from "../state/markPrices";
import { runLiquidations } from "./liquidation";

export type MarkPriceResult = {
  symbol: string;
  markPrice: number;
  liquidations: ReturnType<typeof runLiquidations>;
};

export function updateMarkPrice(
  symbol: string,
  markPrice: number,
  runLiquidation: boolean,
): MarkPriceResult {
  setMarkPrice(symbol, markPrice);

  const liquidations = runLiquidation ? runLiquidations(symbol) : [];

  return { symbol, markPrice, liquidations };
}
