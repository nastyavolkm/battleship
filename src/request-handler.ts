import { MessageType } from "./models/message-type.enum.js";
import { userControllerService } from "./user-controller-service.js";
import { WsRawDataModel } from "./models/ws-raw-data.model";
import { User } from "./models/user.js";
import { createGameForUsers } from "./handlers/create-game-for-users.js";
import { stringifyResponse } from "./utils/stringify-response.js";
import { updateRoomsState } from "./handlers/update-rooms-state.js";
import { AddShipsDtoModel } from "./models/add-ships-dto.model.js";
import { startGame } from "./handlers/start-game.js";
import { AttackDtoModel } from "./models/attack-dto.model.js";
import { currentPlayerIndex, sendTurn } from "./handlers/send-turn.js";
import { getEnemyId } from "./utils/get-enemy-id.js";
import { wsClients } from "./storage/ws-clients.js";
import { attackHandler } from "./handlers/attack-handler.js";
import { logResult } from "./utils/log-result.js";

export const requestHandler = async (id: number, dataMessage: Buffer) => {
  const ws = wsClients.get(id)!;
  try {
    let parsedData = JSON.parse(dataMessage.toString());
    if (parsedData.data) {
      const data = JSON.parse(parsedData.data);
      parsedData = { ...parsedData, data };
    }
    let result;
    logResult(`Command: ${parsedData.type} received`);
    switch (parsedData.type) {
      case MessageType.REG:
        result = await userControllerService.registerUser(id, parsedData as WsRawDataModel<User>);
        const userResponse = stringifyResponse(result);
        logResult(`Command: ${userResponse} send`);
        ws.send(userResponse);
        await updateRoomsState();
        break;
      case MessageType.CREATE_ROOM:
        await userControllerService.createRoom(id);
        await updateRoomsState();
        break;
      case MessageType.ADD_USER_TO_ROOM:
        result = await userControllerService.addUserToRoom(id, parsedData as WsRawDataModel<{ indexRoom: number }>);
        await updateRoomsState();
        await createGameForUsers(result);
        break;
      case MessageType.ADD_SHIPS:
        const idGame = await userControllerService.addShips(id, parsedData as WsRawDataModel<AddShipsDtoModel>);
        const isStarted = await startGame(idGame);
        if (isStarted) {
          const enemyId = getEnemyId(idGame, parsedData.data.indexPlayer);
          await sendTurn(idGame, enemyId);
        }
        break;
      case MessageType.RANDOM_ATTACK:
        const randomAttack = {
          ...parsedData.data,
          x: Math.random() * 10,
          y: Math.random() * 10
        };
        await attackHandler({
          ...parsedData,
          data: {
            ...randomAttack
          }
        });
        break;
      case MessageType.ATTACK:
        const { indexPlayer } = parsedData.data as AttackDtoModel;
        if (indexPlayer !== currentPlayerIndex) return;
        await attackHandler(parsedData as WsRawDataModel<AttackDtoModel>);
        break;
      default:
        throw new Error("Bad request");
    }
  } catch (error) {
    throw new Error("Bad request");
  }
};
