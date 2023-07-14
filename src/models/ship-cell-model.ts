import { ShipType } from "./ship-type";

export interface ShipCellModel {
  positions: {
    x: number,
    y: number,
  }[],
  type: ShipType,
}
