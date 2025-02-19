import React, { createContext, useState, useContext, useEffect } from "react";

const API_KEY = "AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s";
const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookError, setBookError] = useState(null)  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [bookclubs, setBookclubs] = useState([]);

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

  const createBook = (title, authors, description, coverImageUrl, publishedDate) => {
    if (!title || !authors || !description || !coverImageUrl || !publishedDate) {
      setError("Missing required fields for book creation");
      return;
    }

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

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
        return true;
      } else {
        setError(data.error || "Login failed");
        return false;
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = (username, password) => {
    setLoading(true);
    setError(null);

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
        } else {
          setError(data.message || "Signup failed");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  useEffect(() => {
    const storedBooks = sessionStorage.getItem("books");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
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
          setUser(userData);
          setIsLoggedIn(true);
          fetchBooks(userData.username);
        })
        .catch((error) => {
          setUser(null);
          setIsLoggedIn(false);
          setBooks([]);
          setError("Error checking session: " + error.message);
        });
    }
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
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
