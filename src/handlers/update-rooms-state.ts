import { wsClients } from "../storage/ws-clients.js";
import { users } from "../storage/users-storage.js";
import { logResult } from "../utils/log-result.js";
import { MessageType } from "../models/message-type.enum.js";
import { rooms } from "../storage/rooms.js";

export const updateRoomsState = async() => {
  const roomResponse =  JSON.stringify( {
    type: MessageType.UPDATE_ROOM,
    data: JSON.stringify(rooms.filter((room) => {
      return room.roomUsers.length < 2;
    })),
    id: 0,
  });
  wsClients.forEach((ws, id) => {
    if (users.some(user => user.id === id)) {
      logResult(`Command: ${roomResponse} send`);
      ws.send(roomResponse);
    }
  });
};
