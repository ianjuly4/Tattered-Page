import React, { useEffect, useState } from "react";
import { connectSocket, sendMessage, listenForMessages, disconnectSocket } from "../services/SocketService";  // Fixed import
import "../ChatComponent.css"

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    connectSocket(); 

    // Listen for messages sent from the backend (this is important for receiving messages)
    listenForMessages((data) => {
      setChat((prevChat) => [...prevChat, data.message]); // Append new messages
    });

    return () => {
      disconnectSocket();  
    };
  }, []);

  const handleSendMessage = () => {
    sendMessage(message);  // Send the message to the backend
    setMessage("");  // Clear the input field after sending
  };

  return (
    <div className="chat-container">
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
  );
};

export default ChatComponent;
