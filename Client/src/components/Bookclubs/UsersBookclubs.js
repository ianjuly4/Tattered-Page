import React, { useContext, useState, useEffect } from "react";
import Header from "../Header";
import { MyContext } from "../../MyContext";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import animecoffeeshop from "../../assets/animecoffeeshop.jpg";
import BookclubCard from "./BookclubCard";
import { listenForInvites } from "../../services/SocketService"; 

function UsersBookclubs() {
  const { user, isLoggedIn, createBookclub, error, setError } = useContext(MyContext);
  const { bookclubs } = user || {};  
  const [isLoading, setIsLoading] = useState(true);
  const [incomingInvites, setIncomingInvites] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();

  const formSchema = yup.object().shape({
    name: yup.string().required("Must Enter A BookClub Name.").max(50),
    description: yup.string().required("Must Enter A Bookclub Description ").max(1000),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      createBookclub(values.name, values.description);
    },
  });

  useEffect(() => {
    if (!user && !isLoggedIn) {
      navigate("/bookclubs");
    } else if (user) {
      navigate(`/users/${user.id}/bookclubs`);
    }
    setIsLoading(false);
  }, [user, isLoggedIn, navigate]);

  useEffect(() => {
    setError(null);
  }, [location]);

  useEffect(() => {
    // Listen for incoming invites
    const unsubscribe = listenForInvites((invite) => {
      setIncomingInvites((prevInvites) => [...prevInvites, invite]);
    });

    return () => unsubscribe(); 
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You need to log in to view this page.</div>;
  }

  const backgroundStyle = {
    backgroundImage: `url(${animecoffeeshop})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "140vh",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  return (
    <div>
      <div className="top-0 z-10">
        <Header />
      </div>
      <div style={backgroundStyle}></div>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">{"Bookclub Dashboard"}</h1>

            {/* Display incoming invites */}
            {incomingInvites.length > 0 && (
              <div>
                <h2 className="text-2xl mt-6 mb-4">You Have Bookclub Invitations!</h2>
                <ul>
                  {incomingInvites.map((invite, index) => (
                    <li key={index}>
                      Invitation from user ID {invite.senderId} to join Bookclub {invite.bookclubId} at {invite.timestamp}.
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-2xl mt-6">
              <p className="mt-3">Here are your current book clubs:</p>

              {/* Bookclubs Carousel */}
              <div className="p-4">
                <div className="flex overflow-x-auto space-x-4">
                  {bookclubs && bookclubs.length > 0 ? (
                    bookclubs.map((club, index) => (
                      <BookclubCard key={index} club={club} user={user} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center">
                      <p>No Bookclubs Found, Please Create A Bookclub.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 border-t-4 text-black">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for book lovers</p>
        </div>
      </footer>
    </div>
  );
}

export default UsersBookclubs;
