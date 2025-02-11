import { io } from "socket.io-client";

// Setup the socket connection
const socket = io("http://localhost:5555", {
  transports: ["websocket"],  // Ensures WebSocket is used (important for production)
  cors: {
    origin: "http://localhost:3000",  // Make sure this matches your React app URL in production
    methods: ["GET", "POST"]
  },
  // Optionally pass user data if needed for syncing with logged-in user
  query: {
    userId: localStorage.getItem("user_id") || "",  // Retrieve the user ID (replace with actual user ID source)
  }
});

// Connect and emit a custom event
const connectSocket = () => {
  socket.on('connect', () => {
    console.log("Connected to WebSocket server with ID:", socket.id);
  });

  // Listen for errors
  socket.on('connect_error', (err) => {
    console.error("Connection failed:", err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log("Disconnected from WebSocket server, reason:", reason);
    // Optionally, try to reconnect manually if required
  });

  // Handle reconnection attempts
  socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected to the server on attempt ${attemptNumber}`);
  });

  socket.on('reconnect_error', (error) => {
    console.error("Reconnection failed:", error);
  });
};

// Send a chat message
const sendMessage = (message) => {
  if (socket.connected) {
    socket.emit('chat_message', { message });
  } else {
    console.warn("Socket is not connected, message not sent.");
  }
};

// Listen for chat messages
const listenForMessages = (callback) => {
  socket.on('chat_message', (data) => {
    callback(data);
  });
};

// Disconnect the socket
const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Disconnected from WebSocket server");
  } else {
    console.warn("Socket is not connected.");
  }
};

export { connectSocket, sendMessage, listenForMessages, disconnectSocket };
