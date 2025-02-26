import { io } from "socket.io-client";

// Establish socket connection with default configurations
const socket = io("http://127.0.0.1:8000", {
  withCredentials: true, 
  transports: ["websocket"],
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  query: {
    userId: localStorage.getItem("user_id") || "",
    bookclubId: localStorage.getItem("bookclub_id") || "",
  },
});

// Function to handle connection, including joining a room (bookclub chat)
const connectSocket = () => {
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", socket.id);
      
      const bookclubId = localStorage.getItem("bookclub_id");
      const userId = localStorage.getItem("user_id");

      if (bookclubId && userId) {
        socket.emit("join_room", { bookclub_id: bookclubId, user_id: userId });
        resolve(); // Resolve the connection promise
      } else {
        console.warn("No bookclub or user ID found.");
        reject(new Error("Missing user or bookclub ID"));
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      reject(error); // Reject promise if connection fails
    });
  });
};

// Function to send a message (only works if socket is connected)
const sendMessage = (bookclubId, user, message) => {
  if (socket.connected) {
    console.log("Sending message to server:", { bookclub_id: bookclubId, user, message });
    socket.emit("chat_message", { bookclub_id: bookclubId, user, message });
  } else {
    console.warn("Socket not connected, message not sent");
  }
};


// Function to listen for incoming messages
const listenForMessages = (callback) => {
  console.log(callback)
  socket.on("chat_message", callback);
  return () => socket.off("chat_message", callback); // Unsubscribe function
};

// Function to disconnect from chat room
const disconnectChat = (bookclubId, userId) => {
  socket.emit("leave_room", { bookclub_id: bookclubId, user_id: userId });
  socket.disconnect();
  console.log(`User ${userId} left the room ${bookclubId}`);
};

export { connectSocket, sendMessage, listenForMessages, disconnectChat, socket};
