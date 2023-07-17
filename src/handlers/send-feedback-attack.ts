import { games } from "../storage/games.js";
import { wsClients } from "../storage/ws-clients.js";
import { logResult } from "../utils/log-result.js";

export const sendFeedbackAttack = async (gameId: number, attackResponse: string) => {
  const game = games.find((game) => game.idGame === gameId);
  if (game) {
    game.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      logResult(`Command: ${attackResponse} send`);
      ws.send(attackResponse);
    });
  }
};
