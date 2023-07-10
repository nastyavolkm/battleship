import { WebSocketServer } from 'ws';

const DEFAULT_PORT = 3000;

export const wss = new WebSocketServer({ port: DEFAULT_PORT });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});
