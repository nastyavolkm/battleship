import { wsClients } from "../storage/ws-clients.js";
import { users } from "../storage/users-storage.js";

export const updateRoomsState = (roomResponse: string) => {
  wsClients.forEach((ws, id) => {
    if (users.some(user => user.id === id)) {
      ws.send(roomResponse);
    }
  });
};
