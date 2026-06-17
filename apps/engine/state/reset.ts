import { resetMarkets } from "./markets";
import { resetMarkPrices } from "./markPrices";
import { resetOrderbook } from "./orderbook";
import { resetPositions } from "./positions";
import { resetUsers } from "./users";

export function resetAll() {
  resetUsers();
  resetOrderbook();
  resetPositions();
  resetMarkPrices();
  resetMarkets();
}
