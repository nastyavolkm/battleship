import { wsClients } from "../storage/ws-clients.js";
import { games } from "../storage/games.js";
import { MessageType } from "../models/message-type.enum.js";

export const sendTurn = async (gameId: number) => {
  const game = games.find((game) => game.idGame === gameId);
  if (game) {
    wsClients.forEach((id, ws) => {
      if (game.players.some((player) => player.idPlayer === id)) {
        ws.send(JSON.stringify({
          type: MessageType.TURN,
          id: 0,
          data: JSON.stringify({
            currentPlayerIndex: id,
          }),
        }));
      }
    });
  }
};
