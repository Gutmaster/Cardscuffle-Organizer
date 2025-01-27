import React, { useEffect, useState } from "react";
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import Photographs from "./Photographs.js"
import Animals from "./Animals.js"
import Locations from "./Locations.js"
import NewPhoto from "./NewPhoto.js"
import SignUp from "./SignUp.js"
import PatienceGame from "./PatienceGame.js"
import { Switch, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState()
  const [users, setUsers] = useState([])
  const [animals, setAnimals] = useState([])
  const [locations, setLocations] = useState([])
  const [photos, setPhotos] = useState([])
  const [scores, setScores] = useState([])

  function fetchUsers(){
    fetch("/_users")
     .then((r) => r.json())
     .then(json => setUsers(json));
  }
  function fetchScores(){
    fetch("/_scores")
     .then((r) => r.json())
     .then(json => setScores(json));
  }
  
  useEffect(() => {
    fetchScores()
    fetchUsers()
    fetch("/_animals")
      .then((r) => r.json())
      .then(json => setAnimals(json));
    fetch("/_locations")
      .then((r) => r.json())
      .then(json => setLocations(json));
  }, [photos]);

  useEffect(() => {
    fetch("/_photographs")
      .then((r) => r.json())
      .then(setPhotos)
  }, []);

  // function handleSubmitNewUser(username, password) {
  //     fetch('/_users', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ username, password }),
  //     })
  //     .then((r) => r.json())
  //     .then((user) => {
  //         setUser(user)
  //         setUsers(...users, user)
  //     });
  // }

  function handleDeletePhoto(id) {
    fetch(`/_photographs/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setPhotos((photos) =>
          photos.filter((photo) => photo.id !== id)
        );
      }
    });
  }

  function handleEditPhoto(id, animal_id, location_id) {
    fetch(`/_photographs/${id}`, 
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({animal_id: animal_id, location_id: location_id})
      }).then((r) => {
      if(r.ok){
        setPhotos((photos) =>
          photos.map((photo) =>
            photo.id === id? 
              {...photo, animal_id, location_id, animal: animals.find(animal => animal.id === animal_id), location: locations.find(location => location.id === location_id)} 
            : photo
          )
        )
      }
    })
  }

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
        <Route exact path="/animals">
          <Animals animals={animals}/>
        </Route>
        <Route exact path="/locations">
          <Locations locations={locations}/>
        </Route>
        <Route exact path="/photographs">
          <Photographs photos={photos}
                       animals={animals} 
                       locations={locations} 
                       handleDelete={handleDeletePhoto} 
                       confirmEdit={handleEditPhoto}/>
        </Route>
        <Route exact path="/newphoto">
          <NewPhoto animals={animals} locations={locations} photos={photos} setPhotos={setPhotos}/>
        </Route>
        <Route exact path="/patiencegame">
          <PatienceGame user={user} scores={scores} fetchScores={fetchScores}/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
