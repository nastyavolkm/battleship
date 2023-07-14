import { ShipCellModel } from "./ship-cell-model";

export interface PlayerModel {
  idPlayer: number,
  isWinner: boolean,
  ships: ShipCellModel[],
}
