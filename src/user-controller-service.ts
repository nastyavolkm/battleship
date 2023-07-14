import { User } from "./models/user.js";
import { users } from "./storage/users-storage.js";
import { UserResponse } from "./models/user-response.js";
import { WsRawDataModel } from "./models/ws-raw-data.model.js";
import { Room } from "./models/room.js";
import { MessageType } from "./models/message-type.enum.js";
import { rooms } from "./storage/rooms.js";
import { games } from "./storage/games.js";
import { GameModel } from "./models/game.model.js";
import { wsClients } from "./storage/ws-clients.js";
import WebSocket from "ws";
import { AddShipsDtoModel } from "./models/add-ships-dto.model.js";
import { AttackDtoModel } from "./models/attack-dto.model.js";
import { parseShipsToCells } from "./utils/parse-ships-to-cells.js";

class UserControllerService {
  public async registerUser(ws: WebSocket, dataMessage: WsRawDataModel<User>): Promise<WsRawDataModel<UserResponse>> {
    const { type, data, id } = dataMessage;
    const userId = wsClients.get(ws)!;
    const responseData = { error: false, errorText: '' };
    const isUserExists = users.find((item) => item.name === data.name && item.password === data.password);
    if (!isUserExists) {
      users.push({...data, id: userId });
    }
    return {
      type,
      id,
      data: {
        ...data,
        ...responseData
      }
    };
  }

  public async createRoom(ws: WebSocket, dataMessage: WsRawDataModel<string>): Promise<WsRawDataModel<Room[]>> {
    const { id } = dataMessage;
    const userId = wsClients.get(ws)!;
    const roomUser = users.find((item) => item.id === userId);
    if (roomUser) {
      const room: Room = { roomId: userId, roomUsers: [{ name: roomUser.name, index: userId }] };
      rooms.push(room);

      return {
        type: MessageType.UPDATE_ROOM,
        id,
        data: rooms.filter((room) => {
          return room.roomUsers.length < 2;
        }),
      };
    } else {
      throw new Error('No such user exists');
    }
  }

  public async addUserToRoom(ws: WebSocket, dataMessage: WsRawDataModel<{indexRoom: number}>): Promise<number> {
    const userId = wsClients.get(ws)!;
    const newGame: GameModel = {
      idGame: games.length,
      players: [
        {
          idPlayer: userId,
          isWinner: false,
          ships: [],
        },
        {
          idPlayer: users.filter((user) => user.id !== userId)[0].id,
          isWinner: false,
          ships: [],
        },
      ],
      state: 'waiting',
    };
    games.push(newGame);
    const roomForCloseIndex = rooms.findIndex((item) => item.roomId === dataMessage.data.indexRoom);
    rooms.splice(roomForCloseIndex, 1);
    return newGame.idGame;

  }

  public async addShips(ws: WebSocket, dataMessage: WsRawDataModel<AddShipsDtoModel>): Promise<number> {
    const { data } = dataMessage;
    const userId = wsClients.get(ws)!;
    const game = games.find((game) => game.idGame === data.gameId);
    if (game) {
      game.players.find((player) => player.idPlayer === userId)!.ships = parseShipsToCells(data.ships);
    }
    return data.gameId;
  }

  public async attack(ws: WebSocket, dataMessage: WsRawDataModel<AttackDtoModel>): Promise<void> {
    const { data: { gameId, indexPlayer, x, y } } = dataMessage;
    const game = games.find((game) => game.idGame === gameId);
    if (game) {
      const enemyShips = game.players.find((player) => player.idPlayer !== indexPlayer)!.ships;
    }
  }
}

export const userControllerService = new UserControllerService();
