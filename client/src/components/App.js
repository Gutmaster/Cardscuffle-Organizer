import React, { useEffect, useState } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import { Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState()
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    fetch("/_users")
    .then((r) => r.json())
    .then(json => setUsers(json));
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
      </Switch>
    </>
  );
}

export default App;
