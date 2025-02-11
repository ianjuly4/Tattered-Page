import React, { createContext, useState, useContext } from "react";


const API_KEY = "AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s";
const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signUpError, setSignUpError] = useState(null)
  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null)

  const fetchBooks = (searchQuery, filterType) => {
    setLoading(true);
    setError(null);
    
    let url = `https://www.googleapis.com/books/v1/volumes?q=`;

    if (filterType === "title") url += `intitle:${searchQuery}`;
    if (filterType === "author") url += `inauthor:${searchQuery}`;
    if (filterType === "genre") url += `subject:${searchQuery}`;

    url += `&key=${API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.items && data.items.length > 0) {
          setBooks(data.items); 
        } else {
          setError("No books found.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message || "Something went wrong");
      });
  };

 
  const login = (username, password) => {
    setLoginError(null);
    setLoading(true);
  
    return fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
          return true; 
        } else {
          setLoginError(data.error || "Login failed");
          return false; 
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        setLoginError("An error occurred. Please try again later.");
        return false; 
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const signup=(username,password)=>{
    setSignUpError(null);
    setLoading(true);

    fetch("http://127.0.0.1:5555/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {  
          setIsLoggedIn(true);
          setUser(data);  
          console.log("User created");
        } else {
          setSignUpError(data.message || "Signup failed");  
        }
      })
      
      .catch((error) => {
        console.error("Login Error:", error);
        setLoginError("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    fetch("http://127.0.0.1:5555/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        console.log("logout")
        setUser(null);
        setIsLoggedIn(false)
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };


  return (
    <MyContext.Provider value={{
      books,
      loading,
      error,
      loginError, 
      isLoggedIn,
      fetchBooks,
      login,
      user,
      signup,
      logout
    }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
