import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";

export const startGame = async (gameId: number): Promise<boolean> => {
  const game = games.find((game) => game.idGame === gameId);
  if (game?.players.every((player) => player.ships.length > 0)) {
    game.state = "inProgress";
    game.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      const response = JSON.stringify({
        type: MessageType.START_GAME,
        id: 0,
        data: JSON.stringify({
          ships: player.ships,
          currentPlayerIndex: player.idPlayer
        })
      });
      ws.send(response);
    });
    return true;
  }
  return false;
};
