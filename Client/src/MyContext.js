import React, { createContext, useState, useContext, useEffect } from "react";


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
  const [createClubError, setCreateClubError] = useState(null);
  const [createBookError, setCreateBookError] = useState(null)
  const [bookclubs, setBookclubs] = useState([])
  const [createShelfError, setCreateShelfError] = useState(null)


  const createBookclub = (name, description) => {
    setCreateClubError(null);
    setLoading(true);

    fetch("/bookclub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser((prevUser) => ({
            ...prevUser,
            bookshelves: [...prevUser.bookclubs, data], 
          }));
        } else {
          setCreateClubError("Failed to create bookclub");
        }
      })
      .catch((error) => {
        setCreateClubError("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  
  
  {/* CreateBookshelf/Post Function */}
  const createBookshelf = (name, description, genre) => {
    setLoading(true); 
    fetch("/bookshelves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, genre }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser((prevUser) => ({
            ...prevUser,
            bookshelves: [...prevUser.bookshelves, data], 
          }));
        } else {
          setCreateShelfError("Failed to create bookshelf");
        }
      })
      .catch((error) => {
        setCreateShelfError("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  {/*Update Bookshelf/Path bookshelf function */}
  const updateBookshelf = (shelf, bookId) => {
    if (!bookId || !shelf.id) {
      console.error("Invalid shelf or book ID");
      return;
    }
  
    setLoading(true);
    return fetch(`/bookshelves/${shelf.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book_id: bookId }),
    })
      .then((response) => response.json())
      .then((shelfData) => {
        setUser((prevUser) => ({
          ...prevUser,
          bookshelves: prevUser.bookshelves.map((existingShelf) =>
            existingShelf.id === shelf.id
              ? { ...existingShelf, books: [...existingShelf.books, { id: bookId }] } 
              : existingShelf
          ),
        }));
        setCreateBookError(null);
      })
      .catch((error) => {
        setCreateBookError(error.message);
        console.error("Error adding book to bookshelf:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  {/*Creating A Book/Post a book function */}
  const createBook = (title, authors, description, coverImageUrl, publishedDate) => {
    if (!title || !authors || !description || !coverImageUrl || !publishedDate) {
      console.error("Missing required fields for book creation");
      return;
    }
  
    setLoading(true);
    return fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        author: authors.join(", "),
        synopsis: description,
        cover_image: coverImageUrl,
        progress: 0,
        published_date: publishedDate || null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser((prevUser) => ({
            ...prevUser,
            books: Array.isArray(prevUser.books) ? [...prevUser.books, data] : [data], // Default to an array if not iterable
          }));
          return data;
        } else {
          throw new Error("Failed to create book. Please try again.");
        }
      })
      .catch((error) => {
        setCreateBookError(error.message);
        console.error("Error creating book:", error);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  {/*FetchBooks/Get Function */}
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

  {/*Login/Post Function */}
  const login = async (username, password) => {
    setLoginError(null);
    setLoading(true);
  
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
        console.log(`${data.user.username} logged in`);
        return true;  
      } else {
        setLoginError(data.error || "Login failed");
        return false; 
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginError("An error occurred. Please try again later.");
      return false;  
    } finally {
      setLoading(false);  
    }
  };
  
  {/*Signup/Post Function */}
  const signup=(username,password)=>{
    setSignUpError(null);
    setLoading(true);

    fetch("/signup", {
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
          console.log(data)
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
 
  {/* Logout/Delete Function*/}
  const logout = () => {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        //console.log("logout")
        setUser(null);
        setIsLoggedIn(false)
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  {/*Useffect/CheckSession Function */}
  useEffect(() => {
    fetch("/check_session", {
      method: 'GET',
      credentials: 'include', 
    })
    .then((response) => {
      //console.log(response);
      if (!response.ok) {
        throw new Error('Session not valid');  
      }
      return response.json();  
    })
    .then((userData) => {
      //console.log(userData.id); 
      setUser(userData);
      setIsLoggedIn(true)
    })
    .catch((error) => {
      console.error("Error checking session:", error);
      setUser(null);
      setIsLoggedIn(false)  
    });
  }, []);



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
      logout,
      createBookclub,
      createBookshelf,
      createBook,
      createBookError,
      updateBookshelf,
    }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
