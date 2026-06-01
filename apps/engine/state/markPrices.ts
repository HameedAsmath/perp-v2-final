const markPrices = new Map<string, number>();

export function resetMarkPrices() {
  markPrices.clear();
}

export function setMarkPrice(symbol: string, markPrice: number) {
  markPrices.set(symbol, markPrice);
}

export function getMarkPrice(symbol: string) {
  return markPrices.get(symbol) ?? 0;
}
