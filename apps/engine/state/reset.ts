import { resetAdlEvents } from "./adl";
import { resetFills } from "./fills";
import { resetInsurance } from "./insurance";
import { resetMarkPrices } from "./markPrices";
import { resetOrderbook } from "./orderbook";
import { resetPositions } from "./positions";
import { resetUsers } from "./users";

export function resetAll() {
  resetUsers();
  resetOrderbook();
  resetFills();
  resetPositions();
  resetMarkPrices();
  resetInsurance();
  resetAdlEvents();
}
