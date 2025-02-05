// src/App.js
import React from 'react';
import LandingPage from './LandingPage';
import { MyContextProvider } from '../MyContext';

function App() {
  return (
    <MyContextProvider>
    <Route>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/landingpage" element={<LandingPage/>}/>
      </Routes>
    </Route>
    </MyContextProvider>
  );
}

export default App;

