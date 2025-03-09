import React, { useEffect, useState, useCallback } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import LogIn from "./LogIn.js"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cards from "./Cards.js"
import Library from "./Library.js"
import NewCard from "./NewCard.js"
import ErrorPage from "./ErrorPage.js";

function App() {
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState([]);
  const [sets, setSets] = useState([]);
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = useCallback((error) => {
    setErrorMessage(error.toString());
    if (window.location.pathname !== "/error")
      navigate("/error");
  }, [navigate]);

  useEffect(() => {
    fetch("/_artists")
    .then(response => {
      if (!response.ok)
        throw new Error('Network response was not ok');
      return response.json();
    })
    .then(json => setArtists(json))
    .catch(error => handleError(error));
    

    fetch("/_sets")
    .then(response => {
      if (!response.ok)
        throw new Error('Network response was not ok');
      return response.json();
    })
    .then(json => setSets(json))
    .catch(error => handleError(error));

    fetch("/_check_session")
    .then((response) => {
      if (!response.ok)
        throw new Error('Network response was not ok');
      else if(response.status === 201)
        return response.json();
      else if(response.status === 401)
        if (window.location.pathname !== "/login")
          navigate("/login");
    })
    .then(json => logInUser(json))
    .catch(error =>handleError(error));
  }, [location, navigate, handleError]);

  function logInUser(user){
    setUser(user)
  }
  return (
    <>
      <Navbar user={user} setUser={setUser}/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp logInUser={logInUser}/>} />
          <Route path="/login" element={<LogIn logInUser={logInUser}/>} />
          <Route path="/newcard" element={<NewCard artists={artists} sets={sets}/>} />
          <Route path="/cards" element={<Cards artists={artists} sets={sets} user={user} setUser={setUser}/>} />
          <Route path="/library" element={<Library artists={artists} sets={sets} user={user}/>} />
          <Route path="/error" element={<ErrorPage message={errorMessage}/>} />
      </Routes>
    </>
  );
}

export default App;
