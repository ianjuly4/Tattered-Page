import React, { useContext, useEffect, useState } from "react";
import { connectSocket, sendMessage, listenForMessages, disconnectSocket } from "../../services/SocketService";
import { MyContext } from "../../MyContext";

const BookclubChat = ({ bookclub }) => {
  const { user, createChatlog, error } = useContext(MyContext);
  
  // Get chatlogs from the bookclub, assuming that bookclub contains chatlogs
  const { chatlogs } = bookclub || {};
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(Array.isArray(chatlogs) ? chatlogs : []);  // Ensure chat is always an array
  const usersInChat = user?.chatUsers || []; // Users participating in the chat

  // Log chatlogs to verify data
  console.log("Chatlogs:", chatlogs);
  
  // Connect socket and listen for messages
  useEffect(() => {
    if (!Array.isArray(chatlogs) || chatlogs.length === 0) return; // Only set up socket connection if chatlogs exist and are an array
    
    connectSocket(); // Establish connection to backend
    const unsubscribe = listenForMessages((data) => {
      // Append new messages to chat
      setChat((prevChat) => [...prevChat, data.message]);
    });

    return () => {
      disconnectSocket(); // Clean up socket connection when component unmounts
      unsubscribe(); // Unsubscribe from the listener
    };
  }, [chatlogs]); // Depend on chatlogs, so effect runs when chatlogs change

  // Send message function
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(bookclub.id, message); // Send the message for the current bookclub

      // Optimistically update the chat UI
      setChat((prevChat) => [...prevChat, { content: message }]); // Assuming new messages are objects with content

      setMessage(""); // Clear input after sending
    }
  };

  // Handle the creation of the chatlog
  const handleCreateChat = () => {
    createChatlog(bookclub.id); // Create chatlog when chat is initiated
  };

  return (
    <div className="max-w-6xl w-full mx-auto bg-primary p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl text-center font-semibold mb-6">Chat Room</h1>
      {error && <div className="error-message">{error}</div>}

      {/* Conditionally render the Create Chat button or the chat UI */}
      {!chatlogs || chatlogs.length === 0 ? (
        <div className="flex justify-center">
          <button
            onClick={handleCreateChat}
            className="p-3 bg-accent text-white rounded-lg transition duration-200 hover:bg-primary"
          >
            Create Chat
          </button>
        </div>
      ) : (
        <>
          <div className="users-list-box bg-secondary p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold">Users in Chat:</h3>
            <ul className="space-y-2">
              {usersInChat.map((user, idx) => (
                <li key={idx} className="text-white">{user.name}</li>
              ))}
            </ul>
          </div>

          <div className="message-box p-4 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto mb-6">
            <ul className="message-list space-y-4">
              {chat.map((msg, idx) => (
                <li key={idx} className="message-item p-3 bg-accent text-white rounded-lg">
                  {msg.content || msg} 
                </li>
              ))}
            </ul>
          </div>

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
        </>
      )}
    </div>
  );
};

export default BookclubChat;
