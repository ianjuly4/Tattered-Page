import React, { useContext } from "react";
import { MyContext } from "../../MyContext";
import { useNavigate } from "react-router-dom";
import InviteCard from "./InviteCard"; // Import InviteCard

const InviteComponent = () => {
  const { invites, setError, setUser } = useContext(MyContext);
  const navigate = useNavigate();

  // Separate the bookclubs by status
  const invitedBookclubs = invites.filter(invite => invite.status === 'invited');
  const acceptedBookclubs = invites.filter(invite => invite.status === 'accepted');

  const acceptInvite = (bookclubId) => {
    fetch(`/bookclub_users/accept/${bookclubId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(new Error("Failed to accept invite."));
        }
        return response.json();
      })
      .then(() => {
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: [...prevUser.bookclubs, { id: bookclubId }],
        }));
        navigate(`/bookclubs/${bookclubId}`);
      })
      .catch((error) => {
        setError("Error accepting invite: " + error.message);
      });
  };

  const declineInvite = (bookclubId) => {
    setError(`You declined the invite to bookclub ${bookclubId}`);
  };

  return (
    <div>
      {invitedBookclubs.length > 0 ? (
        <div className="invites-list">
          <h3 className="text-2xl font-semibold text-center mb-6">Invites</h3>
          <div className="invite-carousel flex flex-wrap justify-center gap-6">
            {invitedBookclubs.map((invite) => (
              <InviteCard
                key={invite.bookclub_id}
                bookclub={invite}
                onAccept={acceptInvite}
                onDecline={declineInvite}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg">No invitations at this time.</p>
      )}

      {/* You can also render accepted bookclubs here, if desired */}
      {acceptedBookclubs.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-center mb-6">Accepted Bookclubs</h3>
          <ul>
            {acceptedBookclubs.map((bookclub) => (
              <li key={bookclub.bookclub_id}>
                <p>{bookclub.bookclub_name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InviteComponent;
