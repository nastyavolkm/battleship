import { ShipCellModel } from "./ship-cell-model";
import { ShipDtoModel } from "./ship-dto.model";

export interface PlayerModel {
  idPlayer: number,
  isWinner: boolean,
  ships: ShipCellModel[],
  DTOShips: ShipDtoModel[],
}
