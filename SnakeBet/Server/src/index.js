import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT ?? 8787);
const TICK_RATE = 60;
const TICK_MS = 1000 / TICK_RATE;

/** @type {Map<string, { ws: import('ws').WebSocket, playerId: string, mode: string, input: { heading: number, boosting: boolean } }>} */
const clients = new Map();
let tick = 0n;

const wss = new WebSocketServer({ port: PORT });

console.log(`SnakeBet game server listening on ws://localhost:${PORT}/game`);

wss.on("connection", (ws, req) => {
  const id = crypto.randomUUID();
  clients.set(id, { ws, playerId: id, mode: "battleRoyale", input: { heading: 0, boosting: false } });

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(String(raw));
      const client = clients.get(id);
      if (!client) return;

      if (msg.type === "join") {
        const payload = JSON.parse(Buffer.from(msg.payload).toString());
        client.mode = payload.mode ?? "battleRoyale";
        client.playerId = payload.playerId ?? id;
        send(ws, "matchFound", {
          matchId: crypto.randomUUID(),
          mode: client.mode,
          opponentName: client.mode === "Max Points" ? "AsyncRival" : null,
          opponentScore: client.mode === "Max Points" ? Math.floor(Math.random() * 120) + 40 : null,
        });
      }

      if (msg.type === "input") {
        const payload = JSON.parse(Buffer.from(msg.payload).toString());
        client.input = { heading: payload.heading, boosting: payload.boosting };
      }
    } catch (err) {
      console.error("bad message", err);
    }
  });

  ws.on("close", () => clients.delete(id));
});

setInterval(() => {
  tick += 1n;
  const now = new Date();
  for (const { ws } of clients.values()) {
    send(ws, "state", {
      tick: Number(tick),
      serverTime: now.toISOString(),
      snakes: [],
      food: [],
      arena: { center: { x: 3000, y: 3000 }, radius: 2000 },
    });
  }
}, TICK_MS);

function send(ws, type, payload) {
  if (ws.readyState !== ws.OPEN) return;
  ws.send(JSON.stringify({ type, payload: Buffer.from(JSON.stringify(payload)) }));
}
