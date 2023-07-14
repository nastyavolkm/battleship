import { ShipType } from "./ship-type.js";
import { ShipStatusType } from "./ship-status-type.js";

export interface ShipModel {
  position: {
    x: number,
    y: number,
  },
  direction: boolean,
  length: number,
  type: ShipType,
  status?: ShipStatusType,
}
