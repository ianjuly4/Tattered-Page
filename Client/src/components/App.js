// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MyContextProvider } from './MyContext'; 
import Navbar from './Navbar';  
import SearchResults from './SearchResults'; 
import BookDetails from './BookDetails'; 
import BookShelves from './BookShelves';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <MyContextProvider>  
      <Navbar />
      <Routes>
        <Route path= "/landingpage" element={<LandingPage/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<SearchResults />} />
        <Route path="/books/:bookKey" element={<BookDetails/>}/>
        <Route path="/bookshelves" element={<BookShelves/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MyContextProvider>
  );
}

export default App;
