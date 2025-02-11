import React, { useEffect, useState } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import { Switch, Route } from "react-router-dom";
import Cards from "./Cards.js"
import NewCard from "./NewCard.js"

function App() {
  const [user, setUser] = useState()
  const [users, setUsers] = useState([])
  const [artists, setArtists] = useState([])
  const [sets, setSets] = useState([])
  const [cards, setCards] = useState([])
  
  useEffect(() => {
    fetch("/_users")
    .then((r) => r.json())
    .then(json => setUsers(json));

    fetch("/_artists")
    .then((r) => r.json())
    .then(json => setArtists(json));

    fetch("/_sets")
    .then((r) => r.json())
    .then(json => setSets(json));

    fetch("/_cards")
    .then((r) => r.json())
    .then(json => setCards(json));
  }, []);

  return (
    <>
      <Navbar user={user}/>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/signup">
          <SignUp users={users} setUsers={setUsers} setUser={setUser}/>
        </Route>
        <Route exact path="/newcard">
          <NewCard artists={artists} sets={sets}/>
        </Route>
        <Route exact path="/cards">
          <Cards cards={cards}/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
