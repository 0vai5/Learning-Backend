import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Container,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { io } from "socket.io-client";

const App = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useMemo(() => {
    return io("http://localhost:5000", {
      autoConnect: false,
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setUsername(localStorage.getItem("username"));
      setIsLoggedIn(true);
    }
  }, [socket]);

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
      socket.connect();
      localStorage.setItem("username", username);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("username");
    socket.disconnect();
    setOnlineUsers(0);
  };

  useEffect(() => {
    if (isLoggedIn) {
      socket.connect();

      socket.on("connectedUsers", (data) => setOnlineUsers(data));

      socket.on("connect", () => {
        console.log("Connected", socket.id);
      });

      socket.on("receiveMessage", (message) => {
        const notificationSound = new Audio("../assets/notification.wav");
        notificationSound.play();
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, self: false },
        ]);
      });
    }

    return () => {
      if (isLoggedIn) {
        socket.disconnect();
        socket.off("connectedUsers");
        socket.off("connect");
        socket.off("receiveMessage");
      }
    };
  }, [isLoggedIn, socket]);

  const handleMessageSend = () => {
    if (message.trim()) {
      const messageObj = {
        message,
        username,
        self: true,
      };

      setMessages([...messages, messageObj]);
      setMessage("");
      socket.emit("sendMessage", messageObj);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      {!isLoggedIn ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Enter your username
          </Typography>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Submit
          </Button>
        </Box>
      ) : (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="10px"
          >
            <Typography variant="h5" gutterBottom>
              Chat Room
              <Box
                display="flex"
                alignItems="center"
                gap="5px"
                component="span"
                style={{ marginLeft: "10px" }}
              >
                <Box
                  component="span"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#59BA23",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                <Typography variant="body2" component="span">
                  {onlineUsers} online
                </Typography>
              </Box>
            </Typography>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          <Paper
            style={{
              height: "300px",
              overflowY: "auto",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {/* Placeholder for chat messages */}
            <Typography variant="body2" color="textSecondary">
              Chat messages will appear here.
            </Typography>
            {messages.length > 0 &&
              messages.map((msg, index) => (
                <Box key={index} marginBottom="10px">
                  <Typography
                    variant="body2"
                    color={msg.self ? "primary" : "textSecondary"}
                    textAlign={msg.self ? "right" : "left"}
                  >
                    <strong>{msg.self ? "You" : msg.username}</strong>:{" "}
                    {msg.message}
                  </Typography>
                </Box>
              ))}
          </Paper>
          <Box display="flex" gap="10px">
            <TextField
              fullWidth
              label="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleMessageSend}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default App;
