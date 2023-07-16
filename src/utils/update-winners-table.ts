import { users } from "../storage/users-storage.js";
import { winnersTable } from "../storage/winners-table.js";

export const updateWinnersTable = (winnerId: number) => {
  const winnerName = users.find((user) => user.id === winnerId)?.name!;
  const winnerInTable = winnersTable.find((winner) => winner.name === winnerName);
  if (winnerInTable) {
    winnerInTable.wins++;
  } else {
    winnersTable.push({
      name: winnerName,
      wins: 1,
    });
  }
};
