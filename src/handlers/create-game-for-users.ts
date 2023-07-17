import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";
import { logResult } from "../utils/log-result.js";

export const createGameForUsers = async (idGame: number) => {
  const gameWithPlayers = games.find((game) => (game.idGame === idGame)
    && game.players.length === 2);
  if (gameWithPlayers) {
    gameWithPlayers.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      const response = JSON.stringify({
        type: MessageType.CREATE_GAME,
        data: JSON.stringify({
          idGame,
          idPlayer: player.idPlayer
        }),
        id: 0,
      });
      logResult(`Command: ${response} send`);
      ws.send(response);
    });
  }
};
