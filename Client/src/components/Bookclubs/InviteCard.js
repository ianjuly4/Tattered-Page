import React from "react";

const InviteCard = ({ bookclub, onAccept, onDecline }) => {
  return (
    <div className="invite-card bg-primary shadow-lg rounded-lg p-4 mx-auto my-4 max-w-xs w-48">
      <p className="bookclub-name text-lg font-semibold text-center mb-4">{bookclub.bookclub_name}</p>
      <div className="invite-actions flex flex-col gap-4 items-center">
        <button
          onClick={() => onAccept(bookclub.bookclub_id)}
          className="accept-btn bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 w-full"
        >
          Accept
        </button>
        <button
          onClick={() => onDecline(bookclub.bookclub_id)}
          className="decline-btn bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 w-full"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default InviteCard;
