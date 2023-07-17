import { ShipDtoModel } from "./ship-dto.model.js";

export interface AddShipsDtoModel {
  gameId: number,
  indexPlayer: number,
  ships: ShipDtoModel[],
}
