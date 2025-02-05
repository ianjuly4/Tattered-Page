import React, { createContext, useState, useEffect } from 'react';

const MyContext = createContext();

function MyContextProvider({ children }) {
  const [query, setQuery] = useState(""); // For storing the search query
  const [books, setBooks] = useState([]); // For storing the search results
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(null); // For handling errors


  const fetchBooks = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}`);
      const data = await response.json();
      setBooks(data.docs); // Set the fetched books to state
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch books. Please try again later.");
    }
  };

  
  useEffect(() => {
    if (query) {
      fetchBooks(query);
    }
  }, [query]); // Dependency array includes `query`, so it triggers when the query changes

  // Return the context provider with state and methods
  return (
    <MyContext.Provider
      value={{
        books,
        loading,
        error,
        query,
        setQuery, // To update the search query
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the BookContext
const useBookContext = () => {
  const context = React.useContext(BookContext);
  if (!context) {
    throw new Error("useBookContext must be used within a BookProvider");
  }
  return context;
};

export { MyContext, MyContextProvider }
