import { MessageType } from "./models/message-type.enum.js";
import { userControllerService } from "./user-controller-service.js";
import { WsRawDataModel } from "./models/ws-raw-data.model";
import { User } from "./models/user";
import WebSocket from "ws";
import { createGameForUsers } from "./handlers/create-game-for-users.js";
import { stringifyResponse } from "./utils/stringify-response.js";
import { updateRoomsState } from "./handlers/update-rooms-state.js";
import { AddShipsDtoModel } from "./models/add-ships-dto.model.js";
import { startGame } from "./handlers/start-game.js";
import { AttackDtoModel } from "./models/attack-dto.model.js";
import { sendTurn } from "./handlers/send-turn.js";

export const requestHandler = async (ws: WebSocket, dataMessage: Buffer) => {
  try {
    let parsedData = JSON.parse(dataMessage.toString());
    if (parsedData.data) {
      const data = JSON.parse(parsedData.data);
      parsedData = { ...parsedData, data };
    }
    let result;
    switch (parsedData.type) {
      case MessageType.REG:
        result = await userControllerService.registerUser(ws, parsedData as WsRawDataModel<User>);
        const userResponse = stringifyResponse(result);
        ws.send(userResponse);
        break;
      case MessageType.CREATE_ROOM:
        result = await userControllerService.createRoom(ws, parsedData as WsRawDataModel<string>);
        const roomResponse = stringifyResponse(result);
        updateRoomsState(roomResponse);
        break;
      case MessageType.ADD_USER_TO_ROOM:
        result = await userControllerService.addUserToRoom(ws, parsedData as WsRawDataModel<{ indexRoom: number }>);
        createGameForUsers(result);
        break;
      case MessageType.ADD_SHIPS:
        const gameId = await userControllerService.addShips(ws, parsedData as WsRawDataModel<AddShipsDtoModel>);
        const isStarted = await startGame(gameId);
        if (isStarted) {
          await sendTurn(gameId);
        }
        break;
      case MessageType.ATTACK:
        await userControllerService.attack(ws, parsedData as WsRawDataModel<AttackDtoModel>);
        break;
      default: throw new Error ('Bad request');
    }
  }
  catch(error) {
    throw new Error('Bad request');
  }
};
