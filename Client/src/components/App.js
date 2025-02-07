// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MyContextProvider } from './MyContext'; 
import Navbar from './Navbar';  
import SearchResults from './SearchResults'; 
import BookDetails from './BookDetails'; 

function App() {
  return (
    <MyContextProvider>  
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<SearchResults />} />
        <Route path="/books/:bookKey" element={<BookDetails/>}/>
      </Routes>
    </MyContextProvider>
  );
}

export default App;
