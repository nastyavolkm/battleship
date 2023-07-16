import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";

export const createGameForUsers = async (idGame: number) => {
  const gameWithPlayers = games.find((game) => (game.idGame === idGame)
    && game.players.length === 2);
  if (gameWithPlayers) {
    gameWithPlayers.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      const response = JSON.stringify({
        type: MessageType.CREATE_GAME,
        id: 0,
        data: JSON.stringify({
          idGame,
          idPlayer: player.idPlayer
        })
      });
      ws.send(response);
    });
  }
};
