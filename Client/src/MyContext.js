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

  // Assume you've added functionality for invites in the backend already, like fetching from /invites endpoint
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
    setError(null);  // Clear any previous error
    
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
          // Check for specific error message in response
          return response.json().then((errorData) => {
            const errorMessage = errorData.error || "Failed to send invite";
            setError(errorMessage);
            throw new Error(errorMessage);  // Throw an error to stop further execution
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Invite sent successfully:', data);
        // Update the user state with the new invite
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

  // Patch/Accept or Reject Invite function


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
        // Successfully updated the invite status, now update the state
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
              // Update the invite status in the specific bookclub
              const updatedInvites = bookclub.invites
                ? bookclub.invites.map((invite) => {
                    if (invite.user_id === userId) {
                      return { ...invite, status: response, responded_at: data.responded_at };
                    }
                    return invite;
                  })
                : []; // Initialize if there were no invites before

              return {
                ...bookclub,
                invites: updatedInvites, // Update the invites in state
              };
            }
            return bookclub; // No change if it's a different bookclub
          }),
        }));
        console.log(`Invite ${response} successfully:`, data); // Log successful response
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setError(error.message || "Failed to update invite status.");
      })
      .finally(() => {
        setLoading(false); // Set loading state back to false
      });
  };

    

  //Create/Post Chatlog function
  const createChatlog = (bookclubId) => {
    setError(null);
  
    // Send the request to the backend to create a chatlog
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
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        // Successfully created the chatlog, now update the state
        setUser((prevUser) => ({
          ...prevUser,
          bookclubs: prevUser.bookclubs.map((bookclub) => {
            if (bookclub.id === bookclubId) {
              // Add the new chatlog to the bookclub's chatlogs
              const updatedChatlogs = bookclub.chatlogs
                ? [...bookclub.chatlogs, data] // Add the chatlog data received from backend
                : [data]; // Initialize if there were no chatlogs before
              return {
                ...bookclub,
                chatlogs: updatedChatlogs, // Update chatlogs in state
              };
            }
            return bookclub; // No change if it's a different bookclub
          }),
        }));
        console.log('Chatlog created successfully:', data); // Log successful creation
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

  

  //Patch/Update Bookshelf
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
    
            if (shelfData.books) {
                setUser((prevUser) => ({
                    ...prevUser,
                    bookshelves: prevUser.bookshelves.map((existingShelf) =>
                        existingShelf.id === shelf.id
                            ? { ...existingShelf, books: [...existingShelf.books, { id: bookId }] }
                            : existingShelf
                    ),
                }));
            }
        })
        .catch((error) => {
            setError("Error adding book to bookshelf: " + error.message);
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

  //Create Post Book 
  const createBook = (title, authors, description, coverImageUrl, publishedDate, bookId) => {
    // Check if all required fields are provided
    if (!title || !authors || !description || !coverImageUrl || !publishedDate || !bookId) {
      setError("Missing required fields for book creation");
      return;
    }
  
    // Validate the published date format
    const isValidDate = (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };
  
    if (!isValidDate(publishedDate)) {
      setError("Invalid date format for publishedDate. Using null.");
      publishedDate = null;  // Use null if the date is invalid
    }
  
    // Prepare the author string in case it's an array
    const authorString = Array.isArray(authors) ? authors.join(", ") : authors;
  
    // Set loading state
    setLoading(true);
    setError(null);
  
    // Prepare the request body
    const requestBody = {
      title,
      author: authorString,
      synopsis: description,
      cover_image: coverImageUrl,
      progress: 0,
      published_date: publishedDate,
      google_key: bookId
    };
  
    // Send the POST request to create the book
    fetch("/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if the returned data contains an ID
        if (data.id) {
          // Update the user state with the new book
          setUser((prevUser) => ({
            ...prevUser,
            books: Array.isArray(prevUser.books) ? [...prevUser.books, data] : [data],
          }));
          return data;
        } else {
          throw new Error(error.message + "Failed to create book. Please try again.");
        }
      })
      .catch((error) => {
        setError('Error creating book'+ error.message);
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
  const login = async (username, password) => {
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
          setError("An error occurred. Please try again.");  
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

  const logout = () => {
    // Send the logout request to the backend
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        // Clear user data from context or state
        setUser(null);
        setIsLoggedIn(false);
  
        // Clear session or local storage data
        localStorage.removeItem("user_id");
        localStorage.removeItem("bookclub_id");
  
        // Disconnect WebSocket connection
        //socket.disconnect();  // Disconnect from WebSocket server
  
        // Optional: Redirect to login or homepage after logout
        window.location.href = '/login';  // Or any other page you want to redirect to
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
        updateBookshelf,
        deleteBook,
        deleteAccount,
        updateUserAttribute,
        createChatlog,
        deleteBookclub,
        sendInvite,
        invites,
        patchInvite
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
