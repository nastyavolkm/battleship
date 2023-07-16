import { games } from "../storage/games.js";
import { wsClients } from "../storage/ws-clients.js";

export const sendFeedbackAttack = async (gameId: number, attackResponse: string) => {
  const game = games.find((game) => game.idGame === gameId);
  if (game) {
    game.players.forEach((player) => {
      const ws = wsClients.get(player.idPlayer)!;
      ws.send(attackResponse);
    });
  }
};
