import { ShipModel } from "./ship-model.js";

export interface AddShipsDtoModel {
  gameId: number,
  indexPlayer: number,
  ships: ShipModel[],
}
