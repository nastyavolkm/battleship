import { ShipType } from "./ship-type";
import { CellStatusEnum } from "./cell-status-enum";

export interface ShipCellModel {
  positions: {
    x: number,
    y: number,
    status: CellStatusEnum,
  }[],
  borderCells: { x: number, y: number, status: CellStatusEnum }[],
  type: ShipType,
}
