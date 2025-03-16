import React from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import LogIn from "./LogIn.js"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import UserCards from "./UserCards.js"
import CardLibrary from "./Library.js"
import NewCard from "./NewCard.js"
import ErrorPage from "./ErrorPage.js";

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/login" element={<LogIn/>} />
          <Route path="/newcard" element={<NewCard/>} />
          <Route path="/usercards" element={<UserCards/>} />
          <Route path="/library" element={<CardLibrary/>} />
          <Route path="/error" element={<ErrorPage/>} />
      </Routes>
    </>
  );
}

export default App;
