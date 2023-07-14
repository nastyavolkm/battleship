import { RoomUser } from "./room-user";

export interface Room {
  roomId: number,
  roomUsers: RoomUser[],

}
