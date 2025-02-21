import React, { useEffect, useState } from "react";
import { connectSocket, sendMessage, listenForMessages, disconnectSocket } from "../../services/SocketService"; // Updated import


const BookclubChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // Connect socket and listen for messages
  useEffect(() => {
    connectSocket();  // Establish the connection to the backend

    // Set up a listener for incoming messages and get the unsubscribe function
    const unsubscribe = listenForMessages((data) => {
      setChat((prevChat) => [...prevChat, data.message]); // Append new messages to the state
    });

    return () => {
      // Cleanup by disconnecting the socket when the component unmounts
      disconnectSocket();
      unsubscribe(); // Call the unsubscribe function to remove the listener
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);  // Send the message to the backend
      setMessage("");  // Clear the input field after sending
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto  bg-primary p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl text-center bg-font-semibold mb-6">Chat Room</h1>

      {/* Message box container */}
      <div className="message-box  p-4 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto mb-6">
        <ul className="message-list space-y-4">
          {chat.map((msg, idx) => (
            <li key={idx} className="message-item p-3 bg-accent text-white rounded-lg">
              {msg}
            </li>
          ))}
        </ul>
      </div>

      {/* Input section */}
      <div className="input-container flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-3 rounded-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-primary text-white rounded-lg transition duration-200 hover:bg-accent"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default BookclubChat;
