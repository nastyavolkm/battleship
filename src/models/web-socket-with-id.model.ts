import WebSocket from "ws";

export interface WebSocketWithIdModel extends WebSocket {
  id: number,
}
