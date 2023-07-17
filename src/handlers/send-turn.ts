import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";
import { logResult } from "../utils/log-result.js";

export let currentPlayerIndex: number = 0;

export const sendTurn = async (gameId: number, playerIdForTurn: number) => {
  const game = games.find((game) => game.idGame === gameId);
  if (game) {
    game.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      const response = JSON.stringify({
        type: MessageType.TURN,
        data: JSON.stringify({
          currentPlayer: playerIdForTurn,
        }),
        id: 0,
      });
      currentPlayerIndex = playerIdForTurn;
      logResult(`Command: ${response} send`);
      ws.send(response);
    });
  }
};
