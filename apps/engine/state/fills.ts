export type Fill = {
  price: number;
  quantity: number;
  makerOrderId: string;
  makerUserId: string;
  takerUserId: string;
};

const fills = new Map<string, Fill>(); // orderId -> fill

export function resetFills() {
  fills.clear();
}

export function addFill(fill: Fill) {
  fills.set(fill.makerOrderId, fill);
}
