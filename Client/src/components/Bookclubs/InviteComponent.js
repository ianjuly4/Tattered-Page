import React, { useContext } from "react";
import { MyContext } from "../../MyContext";
import InviteCard from "./InviteCard";

const InviteComponent = () => {
  const { invites } = useContext(MyContext) || {};
  
  //console.log(invites)
  const invitedBookclubs = invites.filter(invite => invite.status === 'invited');
  const acceptedBookclubs = invites.filter(invite => invite.status === 'accepted');

  
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
