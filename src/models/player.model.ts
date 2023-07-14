import { ShipModel } from "./ship-model.js";

export interface PlayerModel {
  idPlayer: number,
  isWinner: boolean,
  ships: ShipModel[],
}
