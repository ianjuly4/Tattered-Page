import { io } from "socket.io-client";

// Establish socket connection with the server
const socket = io("http://127.0.0.1:8000", {
  withCredentials: true, 
  transports: ["websocket"],  
  query: {
    userId: localStorage.getItem("user_id") || "",
    bookclubId: localStorage.getItem("bookclub_id") || "",
  },
});

// Connect to the socket server
const connectSocket = () => {
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", socket.id);
      
      const bookclubId = localStorage.getItem("bookclub_id");
      const userId = localStorage.getItem("user_id");

      if (bookclubId && userId) {
        socket.emit("join_room", { bookclub_id: bookclubId, user_id: userId });
        resolve(); 
      } else {
        console.warn("No bookclub or user ID found.");
        reject(new Error("Missing user or bookclub ID"));
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      reject(error); 
    });
  });
};

// Send a chat message to the server
const sendMessage = (bookclubId, user, message) => {
  if (socket.connected) {
    console.log("Sending message:", { bookclub_id: bookclubId, user, message });
    socket.emit("chat_message", { bookclub_id: bookclubId, user, message });
  } else {
    console.warn("Socket not connected, message not sent");
  }
};

// Listen for incoming chat messages
const listenForMessages = (callback) => {
  socket.on("chat_message", callback);
  return () => socket.off("chat_message", callback); 
};

// Function to send an invite
const sendInvite = (senderId, recipientId, bookclubId) => {
  socket.emit("send_invite", { senderId, recipientId, bookclubId, timestamp: new Date().toISOString() });
};

// Function to listen for incoming invites
const listenForInvites = (callback) => {
  socket.on("invite_received", callback);
  return () => socket.off("invite_received", callback); 
};

// Disconnect from the WebSocket server and leave the room
const disconnectChat = (bookclubId, userId) => {
  socket.emit("leave_room", { bookclub_id: bookclubId, user_id: userId });
  socket.disconnect();
  console.log(`User ${userId} left the room ${bookclubId}`);
};

export { connectSocket, sendMessage, listenForMessages, disconnectChat, socket, sendInvite, listenForInvites };
