import { AttackDtoModel } from "../models/attack-dto.model.js";
import { userControllerService } from "../user-controller-service.js";
import { WsRawDataModel } from "../models/ws-raw-data.model.js";
import { stringifyResponse } from "../utils/stringify-response.js";
import { sendFeedbackAttack } from "./send-feedback-attack.js";
import { ShotResultEnum } from "../models/shot-result.enum.js";
import { checkWin } from "../utils/check-win.js";
import { sendFinishGame } from "./send-finish-game.js";
import { updateWinnersTable } from "../utils/update-winners-table.js";
import { sendWinnersTableUpdate } from "./send-winners-table-update.js";
import { getEnemyId } from "../utils/get-enemy-id.js";
import { sendTurn } from "./send-turn.js";
import { getKilledShipBorderCellResponse } from "./get-killed-ship-border-cell-response.js";
import { getKilledShipCells } from "../utils/get-killed-ship-cells.js";

export const attackHandler = async (parsedData: WsRawDataModel<AttackDtoModel>) => {
  const { indexPlayer, gameId } = parsedData.data;
  let result = await userControllerService.attack(parsedData as WsRawDataModel<AttackDtoModel>);
  const attackResponse = stringifyResponse(result);
  if (result.data.status === ShotResultEnum.KILLED) {
    const borderCellsResponse = getKilledShipBorderCellResponse(gameId, indexPlayer, result.data);
    await borderCellsResponse.forEach(async (response) => {
      await sendFeedbackAttack(gameId, response);
      await sendTurn(gameId, indexPlayer);
    });
    const cellsResponse = getKilledShipCells(gameId, indexPlayer, result.data);
    cellsResponse.forEach(async (response) => {
      await sendFeedbackAttack(gameId, response);
      await sendTurn(gameId, indexPlayer);
    });
    await sendFeedbackAttack(gameId, attackResponse);
    const isWinner = checkWin(gameId);
    if (isWinner) {
      await sendFinishGame(gameId, indexPlayer);
      updateWinnersTable(indexPlayer);
      await sendWinnersTableUpdate(gameId);
      return;
    }
  } else {
    await sendFeedbackAttack(gameId, attackResponse);
  }
  const enemyId = getEnemyId(gameId, indexPlayer)
  const nextTurnPlayerId = result.data.status === ShotResultEnum.MISS ? enemyId : indexPlayer;
  await sendTurn(gameId, nextTurnPlayerId);
};
