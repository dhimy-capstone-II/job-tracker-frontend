// src/socket.js — one shared Socket.IO connection for the whole app.
//
// The connection is created once and reused. Opening a second one would
// give the user a second socket ID, and the voice chat identifies people
// by socket ID, so they would appear twice in the same room.
//
// autoConnect is false so nothing connects until a page actually needs it.
// Most pages in this app never open a socket at all.

import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const socket = io(BASE_URL, {
  autoConnect: false,

  // Send the httpOnly login cookie with the handshake. The server reads
  // it to work out who is connecting and rejects anyone logged out.
  withCredentials: true,
});
