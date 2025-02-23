import React, { useContext, useEffect, useState } from "react";
import { connectSocket, sendMessage, listenForMessages, socket } from "../../services/SocketService";
import { MyContext } from "../../MyContext";

const BookclubChat = ({ bookclub }) => {
  const { user, createChatlog, error } = useContext(MyContext);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]); // State for users in the room
  const chatlogs = bookclub.chatlogs || [];

  useEffect(() => {
    // Ensure socket is connected when the component loads
    connectSocket();
  
    // Join the room when the component loads
    const joinRoom = () => {
      if (user?.id && bookclub?.id) {
        socket.emit('join_room', { bookclub_id: bookclub.id, username: user.username });
      }
    };
    joinRoom();
  
    // Listen for incoming messages
    const handleMessage = (data) => {
      console.log("Received message:", data);
      setChat((prevChat) => [...prevChat, data]);
    };
  
    // Listen for room user list updates
    const handleRoomUsers = (data) => {
      if (data.bookclub_id === bookclub.id) {
        // Ensure users list is unique by using a Set
        const uniqueUsers = Array.from(new Set(data.users));
        setUsersInRoom(uniqueUsers); // Update users in room state
      }
    };
  
    // Listen for chat messages once
    listenForMessages(handleMessage);
  
    // Listen for room users (unique list)
    socket.on('room_users', handleRoomUsers);
  
    // Cleanup on unmount
    return () => {
      socket.off('room_users', handleRoomUsers); // Cleanup listener for room users
      socket.emit('leave_room', { bookclub_id: bookclub.id, username: user.username });
      socket.off("chat_message", handleMessage); // Clean up message listener
    };
  }, [bookclub.id, user.id]);
  

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(bookclub.id, user.username, message); // Send the message to the server
      setMessage(""); // Clear the message input
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto bg-primary p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl text-center font-semibold mb-6">Chat Room</h1>
      {error && <div className="error-message">{error}</div>}

      {chatlogs.length === 0 ? (
        <div className="flex justify-center">
          <button
         
            className="p-3 bg-accent text-white rounded-lg transition duration-200 hover:bg-primary"
          >
            Create Chat
          </button>
        </div>
      ) : (
        <>
          <div className="message-box p-4 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto mb-6">
            <ul className="message-list space-y-4">
              {chat.map((msg, idx) => (
                <li key={idx} className="message-item p-3 bg-accent text-white rounded-lg">
                  <strong>{msg.user}:</strong> {msg.message}
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
              className="p-3 bg-secondary text-white rounded-lg"
            >
              Send
            </button>
          </div>

          <div className="users-in-room mt-4">
            <h2 className="text-xl font-semibold">Users in this Room:</h2>
            <ul className="space-y-2">
              {usersInRoom.map((user, idx) => (
                <li key={idx} className="p-2 bg-lightgray rounded-lg">
                {user} {/* Replace this with user data if needed */}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default BookclubChat;
