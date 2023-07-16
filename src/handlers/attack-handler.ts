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

export const attackHandler = async (parsedData: WsRawDataModel<AttackDtoModel>) => {
  const { indexPlayer, gameId } = parsedData.data;
  let result = await userControllerService.attack(parsedData as WsRawDataModel<AttackDtoModel>);
  const attackResponse = stringifyResponse(result);
  await sendFeedbackAttack(gameId, attackResponse);
  if (result.data.status === ShotResultEnum.KILL) {
    const isWinner = checkWin(gameId);
    if (isWinner) {
      await sendFinishGame(gameId, indexPlayer);
      updateWinnersTable(indexPlayer);
      await sendWinnersTableUpdate(gameId);
      return;
    }
  }
  const enemyId = getEnemyId(gameId, indexPlayer)
  const nextTurnPlayerId = result.data.status === ShotResultEnum.MISS ? enemyId : indexPlayer;
  await sendTurn(gameId, nextTurnPlayerId);

};
