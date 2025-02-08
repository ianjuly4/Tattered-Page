import React, { createContext, useState, useEffect } from "react";

const API_KEY = "AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s";

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

    let url = `https://www.googleapis.com/books/v1/volumes?q=`;

    // Add the appropriate search filter
    if (filterType === "title") url += `intitle:${searchQuery}`;
    if (filterType === "author") url += `inauthor:${searchQuery}`;
    if (filterType === "genre") url += `subject:${searchQuery}`;

    // Add the API key for authorization
    url += `&key=${API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.items && data.items.length > 0) {
          setBooks(data.items); 
          console.log(url)
          console.log(data.items)
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

//AIzaSyBf_grAHTnhr09zZ0oZI_NQ8AlSyBeXS_s