import { ShipDtoModel } from "./ship-dto.model.js";

export interface StartGameDtoModel {
  ships: ShipDtoModel[],
  currentPlayerIndex: number,
}
