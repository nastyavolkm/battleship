import { User } from "./models/user.js";
import { users } from "./storage/users-storage.js";
import { UserResponse } from "./models/user-response.js";
import { WsRawDataModel } from "./models/ws-raw-data.model.js";
import { Room } from "./models/room.js";
import { MessageType } from "./models/message-type.enum.js";
import { rooms } from "./storage/rooms.js";
import { games } from "./storage/games.js";
import { GameModel } from "./models/game.model.js";
import { AddShipsDtoModel } from "./models/add-ships-dto.model.js";
import { AttackDtoModel } from "./models/attack-dto.model.js";
import { parseShipsToCells } from "./utils/parse-ships-to-cells.js";
import { ShotResultEnum } from "./models/shot-result.enum.js";
import { FeedbackAttackDtoModel } from "./models/feedback-attack-dto.model.js";

class UserControllerService {
  public async registerUser(userId: number, dataMessage: WsRawDataModel<User>): Promise<WsRawDataModel<UserResponse>> {
    const { type, data, id } = dataMessage;
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

  public async createRoom(userId: number, dataMessage: WsRawDataModel<string>): Promise<WsRawDataModel<Room[]>> {
    const { id } = dataMessage;
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

  public async addUserToRoom(userId: number, dataMessage: WsRawDataModel<{indexRoom: number}>): Promise<number> {
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

  public async addShips(userId: number, dataMessage: WsRawDataModel<AddShipsDtoModel>): Promise<number> {
    const { data } = dataMessage;
    const game = games.find((game) => game.idGame === data.gameId);
    if (game) {
      game.players.find((player) => player.idPlayer === userId)!.ships = parseShipsToCells(data.ships);
    }
    return data.gameId;
  }

  public async attack(dataMessage: WsRawDataModel<AttackDtoModel>): Promise<WsRawDataModel<FeedbackAttackDtoModel>> {
    const { id, data: { gameId, indexPlayer, x, y } } = dataMessage;
    let result = '' as ShotResultEnum;
    const game = games.find((game) => game.idGame === gameId);
    if (game) {
      const enemyShips = game.players.find((player) => player.idPlayer !== indexPlayer)!.ships;
      const hitShip = enemyShips.find(({ positions }) => positions
        .some((position) => position.x === x && position.y === y));
      if (hitShip) {
        const leftShipPositions = hitShip.positions.filter((position) => position.x !== x || position.y !== y);
        hitShip.positions = leftShipPositions;
        result = leftShipPositions.length === 0 ? ShotResultEnum.KILL : ShotResultEnum.SHOT;
      } else {
        result = ShotResultEnum.MISS;
      }

      return {
        type: MessageType.ATTACK,
        id,
        data: {
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status: result,
        },
      };
    } else {
      throw new Error('No such game exists');
    }
  }
}

export const userControllerService = new UserControllerService();
