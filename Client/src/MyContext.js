import React, { createContext, useState, useEffect } from "react";


const API_KEY = "AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s";
const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [bookclubs, setBookclubs] = useState([]);

  
  {/*Create/Post BookShelf */}
  const createBookclub = (name, description) => {
    setLoading(true);
    setError(null);  

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
          setError("Failed to create bookclub");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  {/*Create/Post BookShelf */}
  const createBookshelf = (name, description, genre) => {
    setLoading(true);
    setError(null);

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
          setError("Failed to create bookshelf");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  {/*Patch/Update Bookshelve */}
  const updateBookshelf = (shelf, bookId) => {
    if (!bookId || !shelf.id) {
      setError("Invalid shelf or book ID");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/bookshelves/${shelf.id}`, {
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
      })
      .catch((error) => {
        setError("Error adding book to bookshelf: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  {/* Delete/Delete Book function */}
  const deleteBook = (bookId) => {
    setLoading(true);
    setError(null);

    fetch(`/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete book.");
        }
        setUser((prevUser) => ({
          ...prevUser,
          books: prevUser.books.filter((book) => book.id !== bookId),
        }));
        setError("Book deleted successfully!");
      })
      .catch((error) => {
        setError("Error deleting book. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  {/* Create Post Book */}
  const createBook = (title, authors, description, coverImageUrl, publishedDate, key) => {
    if (!title || !authors || !description || !coverImageUrl || !publishedDate || !key) {
      setError("Missing required fields for book creation");
      return;
    }
    //console.log(title, authors, description, coverImageUrl, publishedDate, bookId)

    const isValidDate = (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };

    if (!isValidDate(publishedDate)) {
      setError("Invalid date format for publishedDate. Using null.");
      publishedDate = null;
    }

    setLoading(true);
    setError(null);

    fetch("/books", {
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
        published_date: publishedDate,
        key: key
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser((prevUser) => ({
            ...prevUser,
            books: Array.isArray(prevUser.books) ? [...prevUser.books, data] : [data],
          }));
          return data;
        } else {
          setError("Failed to create book. Please try again.");
        }
      })
      .catch((error) => {
        setError("Error creating book: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          sessionStorage.setItem("books", JSON.stringify(data.items));
        } else {
          setError("No books found.");
          setBooks([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message || "Something went wrong");
      });
  };

  {/*Delete Account */}
  const deleteAccount = (userId) => {
    fetch(`/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setUser(null);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        setError("Delete Account Error: " + error.message);
      });
  };

  
  {/*Login Post Function */}
  const login = async(username, password) => {
    setLoading(true);
    setError(null);
  
    return fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user && data.user.id) {
          setUser(data.user);  
          console.log("Login successful", data.user);
          setIsLoggedIn(true);
          return true;
        } else {
          setError(data.error || "An error occurred. Please try again.");
          return false;
        }
      })
      .catch((error) => {
        setError(error.message || "An error occurred. Please try again later.");
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  
  
  {/*Signup Post Function */}
  const signup = async(username, password) => {
    setLoading(true);
    setError(null);

    fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log('Server response:', data); 
        if (data) {
          console.log(data); 
          setIsLoggedIn(true);
          setUser(data); 
          return true;
        } else {
          setError(data.error || "Signup failed");
          return false;
        }
      })
      
      .catch((error) => {
        setError(error || "An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  {/* Logout Delete Function */}
  const logout = () => {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setUser(null);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        setError("Logout Error: " + error.message);
      });
  };

  {/* Check Session Get Function */}
  useEffect(() => {
    const storedBooks = sessionStorage.getItem("books");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
    fetch("/check_session", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Session not valid");
        }
        return response.json();
      })
      .then((userData) => {
        console.log(userData)
        setUser(userData);
        setIsLoggedIn(true);
        
      })
      .catch((error) => {
        setUser(null);
        setIsLoggedIn(false);
        setBooks([]);
        console.log("Error checking session: " + error.message);
      });
  }, []);

  return (
    <MyContext.Provider
      value={{
        books,
        loading,
        error,
        setError,
        isLoggedIn,
        fetchBooks,
        login,
        user,
        signup,
        logout,
        createBookclub,
        createBookshelf,
        createBook,
        updateBookshelf,
        deleteBook,
        deleteAccount
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
