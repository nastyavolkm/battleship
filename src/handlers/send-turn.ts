import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";

export let currentPlayerIndex: number = 0;

export const sendTurn = async (gameId: number, playerIdForTurn: number) => {
  const game = games.find((game) => game.idGame === gameId);
  if (game) {
    game.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      const response = JSON.stringify({
        type: MessageType.TURN,
        id: 0,
        data: JSON.stringify({
          currentPlayerIndex: playerIdForTurn,
        }),
      });
      currentPlayerIndex = playerIdForTurn;
      ws.send(response);
    });
  }
};
