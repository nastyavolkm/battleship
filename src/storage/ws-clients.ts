import WebSocket from "ws";

export const wsClients = new Map<WebSocket, number>;
