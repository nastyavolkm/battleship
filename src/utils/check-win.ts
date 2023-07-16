import { games } from "../storage/games.js";
import { currentPlayerIndex } from "../handlers/send-turn.js";

export const checkWin = (gameId: number) => {
  const game = games.find((game) => game.idGame === gameId)!;
  const enemyShips = game.players.find((player) => player.idPlayer !== currentPlayerIndex)?.ships!;
  return enemyShips!.every((ship) => ship.positions.length === 0);
}
