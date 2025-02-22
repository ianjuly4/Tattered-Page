import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../MyContext';

const BookclubMembers = ({bookclub, bookclubId}) => {
  const {sendInvite} = useContext(MyContext); // If you're keeping context logic
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [invites, setInvites] = useState([]); // Store invites locally

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); 
      });
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredUsers([]); 
    } else {
      const regex = new RegExp(search.split('').join('.*'), 'i'); 
      const filtered = users.filter((user) => regex.test(user.username));
      setFilteredUsers(filtered);
    }
  }, [search, users]);

  const handleInvite = (userId) => {
    // Locally store the invite without calling the backend
    const newInvite = { userId, bookclubId, timestamp: new Date().toISOString() };

    setInvites((prevInvites) => [...prevInvites, newInvite]);

    // If you want to simulate sending the invite (like a mock API call)
    alert(`Invite sent to user ID: ${userId} for bookclub ID: ${bookclubId}`);
  };

  return (
    <div className="max-w-6xl w-full mx-auto bg-primary p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl text-center text-white font-semibold mb-6">Invite User</h1>

      {/* Search Input */}
      <input
        className="border p-2 rounded-md w-full mb-4"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a user..."
      />

      {/* Displaying filtered users only when search is not empty */}
      {search && (
        <ul className="mt-4 p-4 rounded-lg min-h-[400px] max-h-[600px] overflow-y-auto mb-6">
          {filteredUsers.length === 0 ? (
            <li className="text-center text-white">No users found.</li>
          ) : (
            filteredUsers.map((user) => (
              <li key={user.id} className="flex justify-between items-center text-white p-2 border-b">
                <span>{user.username}</span>
                <button onClick={() => handleInvite(user.id)} className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600">
                  Invite
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Optionally, show a list of current invites */}
      {invites.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-white text-black">
          <h2 className="text-xl font-semibold">Sent Invitations</h2>
          <ul>
            {invites.map((invite, index) => (
              <li key={index} className="border-b py-2">
                User ID: {invite.userId} invited to Bookclub ID: {invite.bookclubId} on {invite.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookclubMembers;
