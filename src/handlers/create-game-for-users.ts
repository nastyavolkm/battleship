import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";

export const createGameForUsers = (idGame: number) => {
  wsClients.forEach((id, ws) => {
    const gameWithPlayers = games.find((game) => (game.idGame === idGame)
      && game.players.some((player) => player.idPlayer === id)
      && game.players.length === 2);
    if (gameWithPlayers) {
      const response = JSON.stringify({
        type: MessageType.CREATE_GAME,
        id: 0,
        data: JSON.stringify({
          idGame,
          idPlayer: id
        })
      });
      ws.send(response);
    }
  });
};
