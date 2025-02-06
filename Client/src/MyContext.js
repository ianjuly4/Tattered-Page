// MyContext.js
import React, { createContext, useState, useEffect } from 'react';

const MyContext = createContext();

function MyContextProvider({ children }) {
  const [query, setQuery] = useState([]);
  const [filter, setFilter] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = (searchQuery, filterType, values) => {
    setQuery(values.searchTerm);
    setFilter(values.filter);
    setLoading(true);
    setError(null);

    let url = `https://openlibrary.org/search.json?q=${searchQuery}`;

    if (filterType === "name") {
      url += `&title=${searchQuery}`;
    } else if (filterType === "author") {
      url += `&author=${searchQuery}`;
    } else if (filterType === "genre") {
      url += `&subject=${searchQuery}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.docs && data.docs.length > 0) {
          setBooks(data.docs);
        } else {
          throw new Error(data.error || 'No books found');
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message || 'Something went wrong');
      });
  };

  useEffect(() => {
    if (query && filter) {
      fetchBooks(query, filter);
    }
  }, [query, filter]);

  return (
    <MyContext.Provider value={{ books, loading, error, query, setQuery, filter, setFilter}}>
      
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
