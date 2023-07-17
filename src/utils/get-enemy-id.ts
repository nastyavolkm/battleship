import { games } from "../storage/games.js";

export const getEnemyId = (gameId: number, currentPlayerIndex: number) => {
  return games.find((game) => game.idGame === gameId)?.players.find((player) => player.idPlayer !== currentPlayerIndex)?.idPlayer!;
};
