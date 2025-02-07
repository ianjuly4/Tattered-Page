import React, { createContext, useState, useEffect } from "react";


const MyContext = createContext();

function MyContextProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");  
  const [filter, setFilter] = useState("title");


  const fetchBooks = (searchQuery, filterType) => {
    setQuery(searchQuery);
    setFilter(filterType);
    setLoading(true);
    setError(null);

    let url = `https://openlibrary.org/search.json?q=${searchQuery}`;
    if (filterType === "title") url += `&title=${searchQuery}`;
    if (filterType === "author") url += `&author=${searchQuery}`;
    if (filterType === "genre") url += `&subject=${searchQuery}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.docs && data.docs.length > 0) {
          setBooks(data.docs); 
        } else {
          setError("No books found.");
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message || "Something went wrong");
      });
  };

  return (
    <MyContext.Provider value={{ books, loading, error, query, setQuery, filter, setFilter, fetchBooks }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
