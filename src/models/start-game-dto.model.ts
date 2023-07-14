import { ShipModel } from "./ship-model.js";

export interface StartGameDtoModel {
  ships: ShipModel[],
  currentPlayerIndex: number,
}
