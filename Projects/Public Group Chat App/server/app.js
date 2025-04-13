import express from "express";
const app = express();
import cors from "cors";
const PORT = process.env.PORT || 5000;
import { createServer } from "http";
import { Server } from "socket.io";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  const connectedUsers = io.sockets.sockets.size;
  io.emit("connectedUsers", connectedUsers);

  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    socket.broadcast.emit("receiveMessage", message); // Corrected event name
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected", socket.id);
    const connectedUsers = io.sockets.sockets.size;
    io.emit("connectedUsers", connectedUsers);
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
