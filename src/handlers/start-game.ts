import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";

export const startGame = () => {
  const game = games.find((game) => game.state === 'waiting');
  if (game) {
    if (game.players.every((player) => player.ships.length > 0)) {
      game.state = 'inProgress';
      wsClients.forEach((id, ws) => {
        if (game.players.some((player) => player.idPlayer === id)) {
          const response = JSON.stringify({
            type: MessageType.START_GAME,
            id: 0,
            data: JSON.stringify({
              ships: game.players.find((player) => player.idPlayer === id)!.ships,
              currentPlayerIndex: id,
            }),
          });
          ws.send(response);
        }
      });
    }
  }

};
