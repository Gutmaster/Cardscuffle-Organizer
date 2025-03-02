import React, { useEffect, useState } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import LogIn from "./LogIn.js"
import { Switch, Route } from "react-router-dom";
import Cards from "./Cards.js"
import NewCard from "./NewCard.js"

function App() {
  const [user, setUser] = useState(null)
  const [artists, setArtists] = useState([])
  const [sets, setSets] = useState([])
  
  const [userArtists, setUserArtists] = useState([])
  const [userSets, setUserSets] = useState([])

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
        return r.json()
    })
    .then(json => logInUser(json))
  }, []);

  function logInUser(user) {
    setUser(user)
    fetch("/_userartistsandsets")
    .then((r) => r.json())
    .then(json => {
      setUserArtists(json.artists)
      setUserSets(json.sets)
    })
  }

  return (
    <>
      <Navbar user={user} setUser={setUser}/>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/signup">
          <SignUp logInUser={logInUser}/>
        </Route>
        <Route exact path="/login">
          <LogIn logInUser={logInUser}/>
        </Route>
        <Route exact path="/newcard">
          <NewCard artists={artists} sets={sets}/>
        </Route>
        <Route exact path="/cards">
          <Cards artists={userArtists} sets={userSets}/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
