import React, { createContext, useState, useEffect } from "react";

const API_KEY = "AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s";
const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  


  // Function to remove a book from a bookclub
  const removeBookFromBookclub = (clubId, bookId, action="remove") => {
    if (!bookId || !clubId) {
      setError("Invalid club or book ID");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    fetch(`/bookclubs/${clubId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: bookId,
        action: action, 
      }),
    })
      .then((response) => response.json()) 
      .then((clubData) => {
        if (Array.isArray(clubData.books)) {
         
          setUser((prevUser) => ({
            ...prevUser,
            bookclubs: prevUser.bookclubs.map((existingClub) =>
              existingClub.id === clubId
                ? {
                    ...existingClub,
                    books: existingClub.books.filter((book) => book.id !== bookId), 
                  }
                : existingClub
            ),
          }));
        } else {
        
          setError("Unexpected response format.");
        }
      })
      .catch((error) => {
        
        setError("Error updating bookclub: " + error.message);
        console.error(error); 
      })
      .finally(() => {
 
        setLoading(false);
      });
  };
  


  //Delete Bookclub  
  const deleteBookclub = (clubId) => {
    setLoading(true);
    setError(null);

    fetch(`/bookclubs/${clubId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          setError(error.message ||"Failed to dlete bookclub");
        
        }
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.filter((bookclub) => bookclub.id !== clubId),
        }));
        setError(error.message || "Bookclub deleted successfully!");
      })
      .catch((error) => {
        setError(error.message + "Error deleting bookclub. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
 
      

  //Update bookclub/Patch
  const addBookToBookclub = (clubId, bookId, action = "add") => {
    if (!bookId || !clubId) {
      setError("Invalid club or book ID");
      return;
    }
    setLoading(true);
    setError(null);
  
    fetch(`/bookclubs/${clubId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: bookId,
        action: action,
      }),
    })
    .then((response) => response.json())
    .then((clubData) => {
        if (clubData.books) {
            setUser((prevUser) => ({
                ...prevUser,
                bookclubs: prevUser.bookclubs.map((existingClub) =>
                    existingClub.id === clubId
                        ? {
                              ...existingClub,
                              books: clubData.books,  
                          }
                        : existingClub
                ),
            }));
        }
    })
    .catch((error) => {
        setError("Error updating bookclub: " + error.message);
    })
    .finally(() => {
        setLoading(false);
    });
};
  
  
  
  
  //Create/Post Bookclub 
  const createBookclub = (name, description) => {
    setLoading(true);
    setError(null);  

    fetch("/bookclubs", {
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
            bookclubs: [...prevUser.bookclubs, data],
          }));
        } else {
          setError(error.message ||"Failed to create bookclub");
        }
      })
      .catch((error) => {
        setError(error.mesage || "An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Create/Post BookShelf
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
          setError(error.message || "Failed to create bookshelf");
        }
      })
      .catch((error) => {
        setError(error.message || "An error occurred. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Remove Book from Bookshelf
  const removeBookFromBookshelf = (bookshelfId, bookId, action = "remove") => {
    if (!bookId || !bookshelfId) {
        setError("Invalid shelf or book ID");
        return;
    }

    setLoading(true);
    setError(null);


    fetch(`/bookshelves/${bookshelfId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            book_id: bookId,
            action: action,
        }),
    })
        .then((response) => {
            if (!response.ok) {
             
                throw new Error("Failed to remove book from bookshelf.");
            }
            return response.json();
        })
        .then((shelfData) => {
            if (shelfData.books) {
               
                setUser((prevUser) => ({
                    ...prevUser,
                    bookshelves: prevUser.bookshelves.map((existingShelf) =>
                        existingShelf.id === bookshelfId
                            ? {
                                  ...existingShelf,
                                  books: shelfData.books, 
                              }
                            : existingShelf
                    ),
                }));
            } else {
                
                throw new Error("No books found in the response.");
            }
        })
        .catch((error) => {
            
            setError("Error removing book from bookshelf: " + error.message);
        })
        .finally(() => {
            setLoading(false);
        });
};



  //Add Book to Bookshelf
  const addToBookshelf = (shelfId, bookId, action = "add") => {
    if (!bookId || !shelfId) {
        setError("Invalid shelf or book ID");
        return;
    }
    setLoading(true);
    setError(null);

    fetch(`/bookshelves/${shelfId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            book_id: bookId, 
            action: action
        }),
    })
        .then((response) => response.json())
        .then((shelfData) => {
            if (shelfData.books) {
                setUser((prevUser) => ({
                    ...prevUser,
                    bookshelves: prevUser.bookshelves.map((existingShelf) =>
                        existingShelf.id === shelfId
                            ? {
                                  ...existingShelf,
                                  books: shelfData.books,  
                              }
                            : existingShelf
                    ),
                }));
            }
        })
        .catch((error) => {
            setError("Error updating bookshelf: " + error.message);
        })
        .finally(() => {
            setLoading(false);
        });
};


//Delete bookshelf
const deleteShelf = (shelfId) => {
  setLoading(true);
  setError(null);

  fetch(`/bookshelves/${shelfId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete bookshelf.");
      }
      setUser((prevUser) => ({
        ...prevUser,
        bookshelves: prevUser.bookshelves.filter((shelf) => shelf.id !== shelfId),
      }));
      setError(error || "Bookshelf deleted successfully!");
    })
    .catch((error) => {
      setError(error.message + "Error deleting bookshelf. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
};


  //Delete/Delete Book function 
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
  
        setUser((prevUser) => {
         
          const updatedBooks = prevUser.books.filter((book) => book.id !== bookId);
  
          
          const updatedBookshelves = prevUser.bookshelves.map((shelf) => {
            return {
              ...shelf,
              books: shelf.books.filter((book) => book.id !== bookId), 
            };
          });
  
       
          const updatedBookclubs = prevUser.bookclubs.map((club) => {
            return {
              ...club,
              books: club.books.filter((book) => book.id !== bookId), 
            };
          });
  
          return { ...prevUser, books: updatedBooks, bookshelves: updatedBookshelves, bookclubs: updatedBookclubs };
        });
  
        setError("Book deleted successfully!");
      })
      .catch((error) => {
        setError(error.message + " Error deleting book. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  


  //update book progress
  const updateBookProgress = (bookId, progress) => {
    return fetch(`/books/${bookId}`, {
      method: 'PATCH',
      body: JSON.stringify({ progress: progress }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(updatedBook => {
        setUser(prevUser => {
          const updatedBooks = prevUser.books.map(book =>
            book.id === bookId ? { ...book, progress: updatedBook.progress } : book
          );
          return { ...prevUser, books: updatedBooks };
        });
        return updatedBook;
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
      });
  };
  
  
  


  //Create Post Book 
  const createBook = (title, authors, description, coverImageUrl, bookId) => {
    if (!title || !authors || !description || !coverImageUrl || !bookId) {
      setError("Missing required fields for book creation");
      return;
    }

    setLoading(true);
    setError(null);

    const requestBody = {
      title,
      author: authors.join(", "), 
      synopsis: description,
      cover_image: coverImageUrl,
      progress: 0, 
      google_key: bookId
     
    };

    fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
          throw new Error("Failed to create book. Please try again.");
        }
      })
      .catch((error) => {
        setError('Error creating book: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
};

  
  //Fetch Books
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

  //Update User/ Patch Function 
  const updateUserAttribute = (attribute, value) => {
    const updatedData = { [attribute]: value };
  
    fetch(`/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            setError(data.error || "An error occurred, please try again.");
            throw new Error("Failed to update");
          });
        }
       
        return response.json(); 
      })
      .then(() => {
        setUser((prevUser) => ({
          ...prevUser,
          [attribute]: value, 
        }));
        console.log(`${attribute} updated successfully!`);
      })
      .catch((error) => {
        console.error(`Error updating ${attribute}:`, error.message);
        setError("An unexpected error occurred." + error.message);
      });
  };
  
  


  //Delete Account 
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

  
  //Login Post Function 
  const login = (username, password) => {
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
          setIsLoggedIn(true);
          console.log("Login successful", data.user);
          return true;
        } else if (data.error) {
         
          console.log(data.error);
          setError(data.error + " An error occurred. Please try again.");
          return false;
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message || "An error occurred. Please try again later.");
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };


  ///Signup Post Function
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
    .then((response) => {
        if (!response.ok) {
          
            return response.json().then((data) => {
                throw new Error(data.error || "Signup failed");
            });
        }
        return response.json();
    })
    .then((data) => {
     
        setIsLoggedIn(true);
        setUser(data);
        return true;
    })
    .catch((error) => {
        setError(error.message);  
        return false;
    })
    .finally(() => {
        setLoading(false);
    });
};


  //logout
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
  
        localStorage.removeItem("user_id");
        localStorage.removeItem("bookclub_id");
  
       
        window.location.href = '/dashboard'; 
      })
      .catch((error) => {
        setError("Logout Error: " + error.message);
      });
  };
  
  
  
  //Check Session Get Function 
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
        //console.log("Error checking session: " + error.message);
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
        setLoading,
        createBookclub,
        createBookshelf,
        createBook,
        addToBookshelf,
        deleteBook,
        deleteAccount,
        updateUserAttribute,
        deleteBookclub,
        deleteShelf,
        updateBookProgress,
        addBookToBookclub,
        removeBookFromBookshelf,
        removeBookFromBookclub
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
