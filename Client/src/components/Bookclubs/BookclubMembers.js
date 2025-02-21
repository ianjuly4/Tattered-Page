import React, { useState, useEffect } from 'react';

const BookclubMembers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); 
      });
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredUsers([]); // Keep filtered users empty when search is empty
    } else {
      const regex = new RegExp(search.split('').join('.*'), 'i'); 
      const filtered = users.filter((user) => regex.test(user.username));
      setFilteredUsers(filtered);
    }
  }, [search, users]);

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
                <button className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600">
                  Invite
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default BookclubMembers;
