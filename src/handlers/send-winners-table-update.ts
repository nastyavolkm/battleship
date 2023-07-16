import { games } from "../storage/games.js";
import { winnersTable } from "../storage/winners-table.js";
import { wsClients } from "../storage/ws-clients.js";
import { MessageType } from "../models/message-type.enum.js";

export const sendWinnersTableUpdate = async (gameId: number) => {
  const game = games.find((game) => game.idGame === gameId)!;
  game.players.forEach((player) => {
    const ws = wsClients.get(player.idPlayer)!;
    ws.send(JSON.stringify({
      type: MessageType.UPDATE_WINNERS,
      data: JSON.stringify({
        winnersTable: winnersTable,
      }),
    }));
  });
};
