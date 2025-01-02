import React, {useState} from "react";

function Photograph({id, animal, location, datetime, image, handleDelete, confirmEdit, animals, locations}) {
  const [editMode, setEditMode] = useState(false)
  const [newAnimal, setNewAnimal] = useState(animal)
  const [newLocation, setNewLocation] = useState(location)

  function handleEdit(){
    setEditMode(!editMode)
    if(editMode)
      confirmEdit(id, newAnimal.id, newLocation.id)
  }

  function handleEditAnimal(newId){
    const foundAnimal = animals.find(a => a.id === parseInt(newId))
    if (foundAnimal)
      setNewAnimal(foundAnimal)
  }

  function handleEditLocation(newId){
    const foundLocation = locations.find(l => l.id === parseInt(newId))
    if (foundLocation)
      setNewLocation(foundLocation)
  }

  return (
    <div className="photoCard">
      <div className='container'>
        <img src={image} alt={animal.name}/>
      </div>
      
      <span className='container'>
        {editMode ? <select id="animal" name="animal" value={newAnimal.id} onChange={(e) => handleEditAnimal(e.target.value)}>
                        <option value={'select'}>Select Animal</option>
                        {animals.map((animal) => (
                            <option key={animal.id} value={animal.id}>{animal.name}</option>
                        ))}
                    </select>
        : <h4 className='cardText'>Species: {newAnimal.name}</h4>}

        {editMode ? <select id="location" name="location" value={newLocation.id} onChange={(e) => handleEditLocation(e.target.value)}>
                        <option value={'select'}>Select Location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                    </select>
        : <h4 className='cardText'>Location: {newLocation.name}</h4>}
      
        <h5 className='cardText'>Date: {datetime}</h5>
      </span>
        <span className='container'><button onClick={() => handleDelete(id)}>Delete</button> <button onClick={() => handleEdit()}>{editMode? 'Save':'Edit'}</button></span>
    </div>
  );
}

export default Photograph;