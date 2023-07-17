import { FeedbackAttackDtoModel } from "../models/feedback-attack-dto.model.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";
import { ShotResultEnum } from "../models/shot-result.enum.js";

export const getKilledShipCells = (gameId: number, currentIndexPlayer: number, data: FeedbackAttackDtoModel): string[] => {
  const { position: { x, y } } = data;
  const ships = games.find((game) => game.idGame === gameId)!.players.find((player) => player.idPlayer !== currentIndexPlayer)!.ships;
  const killedShip = ships.find((ship) => ship.positions.some((position) => {
    return position.x === x && position.y === y
  }))!;
  return killedShip.positions.map((cell) => {
    return JSON.stringify({
      type: MessageType.ATTACK,
      data: JSON.stringify({
        position: {
          x: cell.x,
          y: cell.y,
        },
        currentPlayer: currentIndexPlayer,
        status: ShotResultEnum.KILLED,
      }),
      id: 0,
    });
  });

};
