const insuranceFund = new Map<string, number>();

export function resetInsurance() {
  insuranceFund.clear();
}

export function getInsuranceBalance(symbol: string): number {
  return insuranceFund.get(symbol) ?? 0;
}

// Add to fund (liquidation surplus)
export function creditInsurance(symbol: string, amount: number) {
  if (amount <= 0) return;
  insuranceFund.set(symbol, getInsuranceBalance(symbol) + amount);
}

export function debitInsurance(symbol: string, amount: number): number {
  if (amount <= 0) return 0;
  const balance = getInsuranceBalance(symbol);
  const paid = Math.min(balance, amount); // if the balance is less than the amount, we will pay the full balance
  insuranceFund.set(symbol, balance - paid);
  return amount - paid; // if this is not 0, it means that the insurance fund is not enough to cover the loss and the ADL will be triggered
}

export function getInsuranceFundView(symbol: string) {
  return { symbol, balance: getInsuranceBalance(symbol) };
}
