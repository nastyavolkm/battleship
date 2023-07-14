import { ShipType } from "./ship-type.js";

export interface ShipModel {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: ShipType,
}
