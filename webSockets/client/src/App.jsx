import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Typography, Button, TextField } from "@mui/material";

const App = () => {
  const [inputMessage, setInputMessage] = useState(""); // State for the input field
  const [messages, setMessages] = useState([]); // State for the list of messages

  const socket = useMemo(() => io("http://localhost:5000"), []);

  const handleSubmission = () => {
    socket.emit("message", inputMessage); // Emit the input message to the server
    setMessages((prevMessages) => [...prevMessages, inputMessage]); // Add the input message to the list
    setInputMessage(""); // Clear the input field
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Add received message to the list
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, [socket]);

  return (
    <>
      <TextField
        id="filled-basic"
        value={inputMessage} // Bind the input field to inputMessage
        onChange={(e) => setInputMessage(e.target.value)} // Update inputMessage on change
        label="Message"
        variant="filled"
      />
      <Button variant="contained" onClick={handleSubmission}>
        Submit
      </Button>
      {messages.length > 0 &&
        messages.map((message, index) => (
          <Typography key={index} variant="h6">
            {message}
          </Typography>
        ))}
    </>
  );
};

export default App;
