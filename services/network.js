import { Peer } from "peerjs";

export async function createGameId(rng) {
  const response = await fetch("../database/names.txt").then((e) => e.text());
  const names = response.split("\n");
  const randomIndex = rng.nextInt() % names.length;
  const name = names[randomIndex].trim();
  const postfix = rng.nextInt() % 10000;
  return `${name}-${postfix}`;
}

export function broadcast(peer, data) {
  for (const id in peer.connections) {
    for (const connection of peer.connections[id]) {
      connection.send(data);
    }
  }
}

export function hostGame(gameId, onEvent) {
  const peer = new Peer(gameId);
  const send = data => broadcast(peer, data);
  peer.on("open", (id) => {
    console.log("Game hosted with id", id);
  });
  peer.on("connection", (connection) => {
    console.log("Connection established", connection);
    connection.on("data", data => onEvent(data, connection));
  });
  peer.on("error", (error) => {
    console.error(error);
  });
  return { peer, send };
}

export function joinGame(gameId, onEvent) {
  const peer = new Peer();
  const send = data => broadcast(peer, data);
  peer.on("open", (id) => {
    console.log("Connected to peer server with id", id);
    const connection = peer.connect(gameId);
    connection.on("open", () => {
      console.log("Connected to game", gameId);
      connection.on("data", data => onEvent(data, connection));
    });
  })
  return { peer, send };
}
