import React, { createContext, useState, useContext } from "react";

// API key and context setup
const API_KEY = "YOUR_GOOGLE_BOOKS_API_KEY";
const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch books based on search query and filter type
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

  // Handle login action
  const login = (username, password) => {
    setLoginError(null);
    setLoading(true);

    fetch("/login", {
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
        } else {
          setLoginError(data.error || "Login failed");
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

  return (
    <MyContext.Provider value={{
      books,
      loading,
      error,
      loginError,
      isLoggedIn,
      fetchBooks,
      login
    }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
