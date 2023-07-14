import { ShipDtoModel } from "../models/ship-dto.model";
import { ShipCellModel } from "../models/ship-cell-model";

export const parseShipsToCells = (ships: ShipDtoModel[]): ShipCellModel[] => {
  return ships.map(({position : {x, y}, direction, length, type}) => {
    const shipCells: { x: number, y: number }[] = [];
    for (let i = 0; i < length; i++) {
      shipCells.push({
          x: direction ? x + i : x,
          y: direction ? y : y + i,
      });
    }
    return ({
      type,
      positions: shipCells,
    });
  });
};
