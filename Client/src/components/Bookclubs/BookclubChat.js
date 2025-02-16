import React, { useEffect, useState } from "react";
import { connectSocket, sendMessage, listenForMessages, disconnectSocket } from "../../services/SocketService"; // Fixed import
import "../ChatComponent.css";
import Header from "../Header";

const BookclubChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // Connect socket and listen for messages
  useEffect(() => {
    connectSocket();  // Establish the connection to the backend

    // Set up a listener for incoming messages
    const unsubscribe = listenForMessages((data) => {
      setChat((prevChat) => [...prevChat, data.message]); // Append new messages to the state
    });

    return () => {
      // Cleanup by disconnecting the socket when the component unmounts
      disconnectSocket();
      unsubscribe(); // Remove the listener
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);  // Send the message to the backend
      setMessage("");  // Clear the input field after sending
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      <div className="chat-container bg-primary">
        <h1>Chat Room</h1>
        
        {/* Message box container */}
        <div className="message-box">
          <ul className="message-list">
            {chat.map((msg, idx) => (
              <li key={idx} className="message-item">{msg}</li>
            ))}
          </ul>
        </div>

        {/* Input section */}
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
};

export default BookclubChat;
