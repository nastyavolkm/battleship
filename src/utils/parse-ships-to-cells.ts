import { ShipDtoModel } from "../models/ship-dto.model.js";
import { ShipCellModel } from "../models/ship-cell-model.js";
import { CellStatusEnum } from "../models/cell-status-enum.js";
import { setEmptyBorderCells } from "./set-empty-border-cells.js";

export const parseShipsToCells = (ships: ShipDtoModel[]): ShipCellModel[] => {
  return ships.map(({position : {x, y}, direction, length, type}) => {
    const shipCells: { x: number, y: number, status: CellStatusEnum }[] = [];
    for (let i = 0; i < length; i++) {
      shipCells.push({
        x: direction ? x : x + i,
        y: direction ? y + i : y,
        status: CellStatusEnum.FULL,
      });
    }
    const borderCells = setEmptyBorderCells({ x, y }, direction, length);
    return ({
      type,
      positions: shipCells,
      borderCells,
    });
  });
};
