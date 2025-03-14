import React, { useEffect, useState, useCallback } from "react";
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
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = useCallback((error) => {
    setErrorMessage(error.toString());
    if (window.location.pathname !== "/error")
      navigate("/error");
  }, [navigate]);

  useEffect(() => {
    fetch("/check_session")
    .then((response) => {
      if(response.status === 201)
        return response.json();
      else if(response.status === 401)
        if(window.location.pathname !== "/login" && window.location.pathname !== "/signup" && window.location.pathname !== "/")
          navigate("/login");
    })
    .then(json => setUser(json))
    .catch(error =>handleError(error));
  }, [location, navigate, handleError]);

  return (
    <>
      <Navbar user={user} setUser={setUser}/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp setUser={setUser}/>} />
          <Route path="/login" element={<LogIn setUser={setUser}/>} />
          <Route path="/newcard" element={<NewCard/>} />
          <Route path="/usercards" element={<UserCards user={user} setUser={setUser}/>} />
          <Route path="/library" element={<CardLibrary user={user}/>} />
          <Route path="/error" element={<ErrorPage message={errorMessage}/>} />
      </Routes>
    </>
  );
}

export default App;
