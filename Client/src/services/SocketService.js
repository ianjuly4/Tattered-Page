import { io } from "socket.io-client";

// Setup the socket connection
const socket = io("http://localhost:5555", {
  transports: ["websocket"],  // Ensures WebSocket is used (important for production)
  cors: {
    origin: " http://localhost:3000",  // You can replace '*' with your React app URL for production
    methods: ["GET", "POST"]
  }
});

// Connect and emit a custom event
const connectSocket = () => {
  socket.on('connect', () => {
    console.log("Connected to WebSocket server");
  });
};

// Send a chat message
const sendMessage = (message) => {
  socket.emit('chat_message', { message });
};

// Listen for chat messages
const listenForMessages = (callback) => {
  socket.on('chat_message', (data) => {
    callback(data);
  });
};

// Disconnect the socket
const disconnectSocket = () => {
  socket.disconnect();
};

export { connectSocket, sendMessage, listenForMessages, disconnectSocket };
