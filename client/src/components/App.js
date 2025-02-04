import React, { useEffect, useState } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import { Switch, Route } from "react-router-dom";
import NewCard from "./NewCard.js"

function App() {
  const [user, setUser] = useState()
  const [users, setUsers] = useState([])
  const [artists, setArtists] = useState([])
  const [sets, setSets] = useState([])

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
      </Switch>
    </>
  );
}

export default App;
