import { WebSocketServer } from 'ws';
import { requestHandler } from "../request-handler.js";
import { wsClients } from "../storage/ws-clients.js";

const DEFAULT_PORT = 3000;

export const wss = new WebSocketServer({ port: DEFAULT_PORT });
let idNumber = 0;

wss.on('connection', function connection(ws) {
  const id = idNumber++;
  wsClients.set(id, ws);
  ws.on('error', console.error);

  ws.on('message', async (buffer: Buffer) => {
    await requestHandler(id, buffer);
  });

});
