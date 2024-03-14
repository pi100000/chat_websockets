const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const crypto = require("crypto");

const port = 4001;
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cors());

server.listen(port, () => {
  console.log("Server running on", port);
});

const chatHistory = [];
const clients = new Map();

// sockets
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    socket.id = sessionID;
    clients.set(sessionID, socket);
  } else {
    const id = crypto.randomBytes(16).toString("hex");
    socket.id = id;
    clients.set(id, socket);
  }
  next();
});

io.on("connection", (socket) => {
  socket.emit("chat-history", chatHistory);

  socket.on("ping", (data) => {
    chatHistory.push({ id: socket.id, message: data });

    io.emit("ping-recd", { id: socket.id, message: data });
  });

  socket.on("disconnect", () => {
    clients.delete(socket.id);
    console.log("User disconnected:", socket.id);
  });
});
