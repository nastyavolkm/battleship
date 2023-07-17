import { WebSocketServer } from 'ws';
import { requestHandler } from "../request-handler.js";
import { wsClients } from "../storage/ws-clients.js";
import { logResult } from "../utils/log-result.js";

const DEFAULT_PORT = 3000;

export const wss = new WebSocketServer({ port: DEFAULT_PORT });
let idNumber = 0;

wss.on('connection', function connection(ws) {
  const id = idNumber++;
  wsClients.set(id, ws);
  logResult(`WebSocket Client with id ${id} connected on ${DEFAULT_PORT} port`);
  ws.on('error', console.error);

  ws.on('message', (buffer: Buffer) => {
    requestHandler(id, buffer);
  });

  ws.on('close', () => {
    wsClients.delete(id);
    logResult(`WebSocket Client with id ${id} disconnected`);
  });
});
