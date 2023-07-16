import { ShipDtoModel } from "../models/ship-dto.model";
import { ShipCellModel } from "../models/ship-cell-model";

export const parseShipsToCells = (ships: ShipDtoModel[]): ShipCellModel[] => {
  return ships.map(({position : {x, y}, direction, length, type}) => {
    const shipCells: { x: number, y: number }[] = [];
    shipCells.push({ x, y });
    for (let i = 1; i < length; i++) {
      shipCells.push({
          x: direction ? x : x + i,
          y: direction ? y + i : y,
      });
    }

    return ({
      type,
      positions: shipCells,
    });
  });
};
