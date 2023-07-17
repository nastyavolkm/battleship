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
import { CellStatusEnum } from "./models/cell-status-enum.js";

class UserControllerService {
  public async registerUser(userId: number, dataMessage: WsRawDataModel<User>): Promise<WsRawDataModel<UserResponse>> {
    const { type, data, id } = dataMessage;
    const responseData = { error: false, errorText: '' };
    const isUserWithSuchNameExists = users.find((item) => item.name === data.name);
    if (isUserWithSuchNameExists) {
      const isWrongPassword = isUserWithSuchNameExists.password !== data.password;
      if (isWrongPassword) {
        responseData.error = true;
        responseData.errorText = 'Wrong password!';
      }
    } else {
      users.push({...data, id: userId });
    }
    return {
      type,
      data: {
        ...data,
        ...responseData
      },
      id,
    };
  }

  public async createRoom(userId: number): Promise<void> {
    const roomUser = users.find((item) => item.id === userId);
    if (roomUser) {
      const room: Room = { roomId: userId, roomUsers: [{ name: roomUser.name, index: userId }] };
      rooms.push(room);
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
          DTOShips: [],
        },
        {
          idPlayer: rooms.find((room) => room.roomId === dataMessage.data.indexRoom)!.roomUsers[0]!.index,
          isWinner: false,
          ships: [],
          DTOShips: [],
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
      const player = game.players.find((player) => player.idPlayer === userId)!;
      player.ships = parseShipsToCells(data.ships);
      player.DTOShips = data.ships;
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
        hitShip.positions.forEach((position) => {
          if (position.x === x && position.y === y) {
            position.status = CellStatusEnum.KILLED;
          }
        });
        result = hitShip.positions.some((position) => position.status === CellStatusEnum.FULL)
          ? ShotResultEnum.SHOT
          : ShotResultEnum.KILLED;
      } else {
        result = ShotResultEnum.MISS;
      }

      return {
        type: MessageType.ATTACK,
        data: {
          position: {
            x,
            y,
          },
          currentPlayer: indexPlayer,
          status: result,
        },
        id,
      };
    } else {
      throw new Error('No such game exists');
    }
  }
}

export const userControllerService = new UserControllerService();
