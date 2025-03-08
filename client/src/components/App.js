import React, { useEffect, useState } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import LogIn from "./LogIn.js"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cards from "./Cards.js"
import Library from "./Library.js"
import NewCard from "./NewCard.js"

function App() {
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState([]);
  const [sets, setSets] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("/_artists")
    .then((r) => r.json())
    .then(json => setArtists(json));

    fetch("/_sets")
    .then((r) => r.json())
    .then(json => setSets(json));

    fetch("/_check_session")
    .then((r) => {
      if(r.status === 201)
        return r.json();
      else if(r.status === 401)
        console.log("Current pathname:", window.location.pathname);
        if (window.location.pathname !== "/login") {
          console.log("Redirecting to /login");
          navigate("/login");
        }
    })
    .then(json => logInUser(json))
  }, [location, navigate]);

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
      </Routes>
    </>
  );
}

export default App;
