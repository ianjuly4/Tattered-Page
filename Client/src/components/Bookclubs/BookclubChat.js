import React, { useContext, useEffect, useState } from "react";
import { connectSocket, sendMessage, listenForMessages, disconnectSocket, socket } from "../../services/SocketService";
import { MyContext } from "../../MyContext";

const BookclubChat = ({ bookclub }) => {
  const { user, createChatlog, error } = useContext(MyContext);
  
  // Get chatlogs from the bookclub, assuming that bookclub contains chatlogs
  const { chatlogs } = bookclub || {};
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(Array.isArray(chatlogs) ? chatlogs : []);  // Ensure chat is always an array
  const usersInChat = user?.chatUsers || []; // Users participating in the chat

  // Log chatlogs to verify data
  //console.log("Chatlogs:", chatlogs);
  
  // Connect socket and listen for messages
  useEffect(() => {
    if (!Array.isArray(chatlogs) || chatlogs.length === 0) return;
    connectSocket();
    console.log("Socket connected");
    const unsubscribe = listenForMessages((data) => {
      console.log('Received message:', data);
      if (data?.message) {
        setChat((prevChat) => [...prevChat, { content: data.message, user: data.user }]);
      }
    });
  
    return () => {
      disconnectSocket();
      unsubscribe();
    };
  }, [chatlogs]);
  

  // Send message function
  const handleSendMessage = () => {
    if (message.trim() !== "") {
        // Emit chat_message event with the message
        socket.emit('chat_message', {
            bookclub_id: bookclub.id,
            message: message,
            user: user.username,  // You can send additional user details here
            user_id: user.id,
        });

        // Optimistically update the UI
        setChat((prevChat) => [...prevChat, { content: message, user: user.username }]); // Append message optimistically

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
                <li key={idx} className="text-">{user.name}</li>
              ))}
            </ul>
          </div>

          <div className="message-box p-4 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto mb-6">
            <ul className="message-list space-y-4">
              {chat.map((msg, idx) => (
                <li key={idx} className="message-item p-3 bg-accent text-white rounded-lg">
                  <strong>{msg.user}:</strong> {msg.content}
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
              className="w-full p-3 rounded-lg border border-secondary "
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-secondary text-black border rounded-lg transition duration-200 hover:bg-accent"
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
