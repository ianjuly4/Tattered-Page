import React, { createContext, useState, useEffect } from "react";
import { connectSocket, sendMessage, listenForMessages, disconnectSocket, socket } from "./services/SocketService";

const API_KEY = "AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s";
const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [invites, setInvites] = useState([])

 
  useEffect(() => {
    if (user && user.id) {
      fetch(`/users/${user.id}/invites`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setInvites(data);
        })
        .catch((error) => {
          setError('Error fetching invites: ' + error.message);
        });
    }
  }, [user]);

  //create invite for chatlog
  const sendInvite = (userId, bookclubId) => {
    console.log(userId, bookclubId);
    setError(null); 
    
    fetch('/bookclubs_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookclub_id: bookclubId,
        user_id: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          
          return response.json().then((errorData) => {
            const errorMessage = errorData.error || "Failed to send invite";
            setError(errorMessage);
            throw new Error(errorMessage);  
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Invite sent successfully:', data);
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
              return {
                ...bookclub,
                invites: [...(bookclub.invites || []), data],
              };
            }
            return bookclub;
          }),
        }));
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message || 'Failed to send invite.');
      });
  };



  // Send the request to the backend to update the invite status
  const patchInvite = (userId,bookclubId, response)=>{
    fetch(`/bookclubs_users`, {
      method: 'PATCH',
      headers: {  
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        bookclub_id: bookclubId,
        response: response,  // 'accepted' or 'rejected'
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update invite status");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
      
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
            
              const updatedInvites = bookclub.invites
                ? bookclub.invites.map((invite) => {
                    if (invite.user_id === userId) {
                      return { ...invite, status: response, responded_at: data.responded_at };
                    }
                    return invite;
                  })
                : []; 

              return {
                ...bookclub,
                invites: updatedInvites, 
              };
            }
            return bookclub; 
          }),
        }));
        console.log(`Invite ${response} successfully:`, data); 
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message || "Failed to update invite status.");
      })
      .finally(() => {
        setLoading(false); 
      });
  };

    

  //Create/Post Chatlog function
  const createChatlog = (bookclubId) => {
    setError(null);
  
    
    fetch('/chatlogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookclub_id: bookclubId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create chatlog");
        }
        return response.json(); 
      })
      .then((data) => {
       
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
             
              const updatedChatlogs = bookclub.chatlogs
                ? [...bookclub.chatlogs, data] 
                : [data];
              return {
                ...bookclub,
                chatlogs: updatedChatlogs, 
              };
            }
            return bookclub; 
          }),
        }));
        console.log('Chatlog created successfully:', data); 
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message || "Failed to create chatlog.");
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
        setUser((prevUser) => ({
          ...prevUser,
          books: prevUser.books.filter((book) => book.id !== bookId),
        }));
        setError(error || "Book deleted successfully!");
      })
      .catch((error) => {
        setError(error.message + "Error deleting book. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //update book progress
  const updateBookProgress = (bookId, progress) => {
    fetch(`/books/${bookId}`, {
      method: 'PATCH',
      body: JSON.stringify({ bookProgress: progress }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(updatedBook => {
        setUser((prevUser) => {
          const updatedBooks = prevUser.books.map((book) =>
            book.id === bookId
              ? { ...book, progress: updatedBook.progress } 
              : book
          );
          return {
            ...prevUser, 
            books: updatedBooks, 
          };
        });
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
      });
  };


  //Create Post Book 
  const createBook = (title, authors, description, coverImageUrl, publishedDate, bookId) => {
    if (!title || !authors || !description || !coverImageUrl || !bookId) {
      setError("Missing required fields for book creation");
      return;
    }

    const isValidDate = (dateString) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(dateString);
    };
    const formattedDate = isValidDate(publishedDate) ? publishedDate : 'NA';
    if (formattedDate === 'NA') {
      setError("Invalid date format. Please use YYYY-DD-MM.");
      return;
    }

    const authorString = Array.isArray(authors) ? authors.join(", ") : authors;

    setLoading(true);
    setError(null);

    const requestBody = {
      title,
      author: authorString,
      synopsis: description,
      cover_image: coverImageUrl,
      progress: 0,
      published_date: formattedDate,
      google_key: bookId
    };

    fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
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
      .then((response) => response.json())
      .then((data) => {
        //console.log('Server response:', data); 
        if (data) {
          console.log(data); 
          setIsLoggedIn(true);
          setUser(data); 
          return true;
        } else {
          setError("Signup failed");
          return false;
        }
      })
      
      .catch((error) => {
        setError(error.message + "An error occurred. Please try again later.");
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
        addToBookshelf,
        deleteBook,
        deleteAccount,
        updateUserAttribute,
        createChatlog,
        deleteBookclub,
        sendInvite,
        invites,
        patchInvite,
        deleteShelf,
        updateBookProgress,
        addBookToBookclub,
        removeBookFromBookshelf
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
