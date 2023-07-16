import { games } from "../storage/games.js";
import { wsClients } from "../storage/ws-clients.js";
import { MessageType } from "../models/message-type.enum.js";

export const sendFinishGame = async (gameId: number, winnerId: number) => {
  const game = games.find((game) => game.idGame === gameId)!;
  game.players.forEach((player) => {
    const ws = wsClients.get(player.idPlayer)!;
    ws.send(JSON.stringify({
      type: MessageType.FINISH,
      data: JSON.stringify({
        winPlayer: winnerId,
      }),
    }));
  });
}
