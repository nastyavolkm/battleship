import { CellStatusEnum } from "../models/cell-status-enum.js";

export const setEmptyBorderCells = (position: { x: number, y: number }, direction: boolean, length: number) => {
  const borderCells = [];
  const { x, y } = position;
  borderCells.push({
    x: direction ? x : x - 1,
    y: direction ? y - 1 : y,
    status: CellStatusEnum.EMPTY
  });
  borderCells.push({
    x: direction ? x : x + length,
    y: direction ? y + length : y,
    status: CellStatusEnum.EMPTY
  });

  for (let i = -1; i <= length; i++) {
    const borderCell = direction ? {
      x: x - 1,
      y: y + i,
      status: CellStatusEnum.EMPTY
    } : {
      x: x + i,
      y: y - 1,
      status: CellStatusEnum.EMPTY
    };
    borderCells.push(borderCell);
    const otherSideBorderCell = direction
      ? {
        ...borderCell,
        x: x + 1,
        y: y + i,
      }
      : {
        ...borderCell,
        x: x + i,
        y: y + 1,
      };
    borderCells.push(otherSideBorderCell);
  }

  return borderCells.filter(({ x, y }) => x >= 0 && y >= 0 && x <= 9 && y <= 9);
};
