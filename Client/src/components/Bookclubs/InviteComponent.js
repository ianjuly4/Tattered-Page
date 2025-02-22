import React, { useContext } from "react";
import { MyContext } from "../../MyContext";
import { useNavigate } from "react-router-dom";
import InviteCard from "./InviteCard"; // Import InviteCard

const InviteComponent = () => {
  const { invites, setError, setUser, patchInvite, userId } = useContext(MyContext);
  const navigate = useNavigate();

  // Separate the bookclubs by status
  const invitedBookclubs = invites.filter(invite => invite.status === 'invited');
  const acceptedBookclubs = invites.filter(invite => invite.status === 'accepted');

  const acceptInvite = (userId, bookclubId) => {
    patchInvite(userId, bookclubId, "accepted")
      .then(() => {
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
              const updatedInvites = bookclub.invites.map((invite) => {
                if (invite.bookclub_id === bookclubId) {
                  return { ...invite, status: "accepted" };
                }
                return invite;
              });
              return { ...bookclub, invites: updatedInvites };
            }
            return bookclub;
          }),
        }));
      })
      .catch((error) => {
        console.error("Failed to accept invite:", error);
        setError("Failed to accept the invite.");
      });
  };

  const declineInvite = (userId, bookclubId) => {
    patchInvite(userId, bookclubId, "rejected")
      .then(() => {
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
              const updatedInvites = bookclub.invites.map((invite) => {
                if (invite.bookclub_id === bookclubId) {
                  return { ...invite, status: "rejected" };
                }
                return invite;
              });
              return { ...bookclub, invites: updatedInvites };
            }
            return bookclub;
          }),
        }));
      })
      .catch((error) => {
        console.error("Failed to decline invite:", error);
        setError("Failed to decline the invite.");
      });
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
                onAccept={() => acceptInvite(userId, invite.bookclub_id)}
                onDecline={() => declineInvite(userId, invite.bookclub_id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg">No invitations at this time.</p>
      )}

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
