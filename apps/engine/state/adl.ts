export type AdlEvent = {
  userId: string;
  symbol: string;
  reducedQuantity: number;
  bankruptcyPrice: number;
};

const adlEvents: AdlEvent[] = [];

export function resetAdlEvents() {
  adlEvents.length = 0;
}

export function appendAdlEvent(event: AdlEvent) {
  adlEvents.push(event);
}

export function getAdlEventsView() {
  return { events: [...adlEvents] };
}
