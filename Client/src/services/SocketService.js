// services/SocketService.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5555", {
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000",  // Ensure this matches your React app URL
    methods: ["GET", "POST"]
  },
  query: {
    userId: localStorage.getItem("user_id") || "",  // User data (if needed)
  }
});

const connectSocket = () => {
  socket.on('connect', () => {
    console.log("Connected to WebSocket server with ID:", socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error("Connection failed:", err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log("Disconnected from WebSocket server:", reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected to the server on attempt ${attemptNumber}`);
  });

  socket.on('reconnect_error', (error) => {
    console.error("Reconnection failed:", error);
  });
};

const sendMessage = (message) => {
  if (socket.connected) {
    socket.emit('chat_message', { message });
  } else {
    console.warn("Socket is not connected, message not sent.");
  }
};

const listenForMessages = (callback) => {
  const handleMessage = (data) => {
    callback(data);
  };

  // Listen for messages from the server
  socket.on('chat_message', handleMessage);

  // Return an unsubscribe function
  return () => {
    socket.off('chat_message', handleMessage);  // Remove the event listener when called
  };
};

const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Disconnected from WebSocket server");
  } else {
    console.warn("Socket is not connected.");
  }
};

export { connectSocket, sendMessage, listenForMessages, disconnectSocket };
