import React, { useState, useContext, useEffect } from "react";
import Header from "./Header";
import { MyContext } from "../MyContext";
import { useNavigate } from "react-router-dom";
import library from "../assets/library.jpg";

function UserBookshelves() {
  const { user, isLoggedIn } = useContext(MyContext);
  const { bookshelves } = user || {};  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user)
    console.log(isLoggedIn)
      if (!user && !isLoggedIn) {
        navigate("/login");
      } else if (user) {
        navigate(`/users/${user.id}/bookshelves`);
      }
      setIsLoading(false);
    }, [user, isLoggedIn, navigate]);


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>You need to log in to view this page.</div>;
  }
  
  const backgroundStyle = {
    backgroundImage: `url(${library})`,
    backgroundSize: "150%",  
    backgroundPosition: "center",
    minHeight: "100vh",
    filter: "blur(6px)", 
    opacity: 0.6,
    backgroundRepeat: "no-repeat",
    position: "absolute",  
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, 
  };

  return (
    <div>
      <div className="sticky top-0 z-10">
        <Header />
      </div>
      
      {/* Background div */}
      <div style={backgroundStyle}></div>
      
      {/* Content Section */}
      <div className="hero min-h-screen relative z-20">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">{"Your Bookshelves"}</h1>
            
            <div className="text-2xl mt-6">
              <p className="mt-3">Here are your current bookshelves:</p>

              {/* Bookshelves Carousel */}
              <div className="border p-4 rounded-lg bg-white shadow-lg">
                <div className="flex overflow-x-auto space-x-4">
                  {bookshelves&& bookshelves.length > 0 ? (
                    bookshelves.map((shelf, index) => (
                      <div key={index} className="w-60 p-4 bg-white rounded-xl shadow-lg flex-none">
                        <h2 className="text-xl font-semibold">{shelf.name}</h2>
                        <p>{shelf.description}</p>
                        <button className="btn btn-primary btn-sm mt-4">View Shelf</button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center">
                      <p>No Bookshelves Found, Please Create One.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form to create a bookshelf */}
            <h2 className="text-3xl justify-center flex items-center font-bold mt-24">Create A Bookshelf</h2>

            {/* Your form or input to create a bookshelf here */}
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

export default UserBookshelves;
