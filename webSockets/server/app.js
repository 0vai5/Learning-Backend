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

  socket.on("message", (data) => {
    socket.broadcast.emit("message", `Hello ${data}`);
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
