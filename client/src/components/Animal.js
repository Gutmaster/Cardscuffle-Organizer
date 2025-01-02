import {useState} from "react";

const noImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shoshinsha-design.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fnoimage-760x460.png&f=1&nofb=1&ipt=d872ea62b4b151bf09b2fbf210849cba33aa79c637b5c2ce34dd1d2399081e1b&ipo=images'

function Animal({animal}) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [edit, setEdit] = useState(false)
  let prevEdit = edit
  const [description, setDescription] = useState(animal.description)
  const [alertMessage, setAlertMessage] = useState('')

  function alertReset(){
      setAlertMessage('')
  }

  function handleArrowRight(e) {
    e.preventDefault()
    setPhotoIndex((photoIndex + 1) % animal.photographs.length)
  }
  function handleArrowLeft(e) {
    e.preventDefault()
    setPhotoIndex((photoIndex - 1 + animal.photographs.length) % animal.photographs.length)
  }

  function handleDescriptionChange(d){
    if(d.length <= 200){
      setDescription(d)
    }
  }

  function handleEdit() {
    prevEdit = edit
    if (prevEdit)
    {
        fetch(`/_animals/${animal.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: animal.name, description: description})
        })
        .then(response => {
            if(response.ok)
                return response.json()
            else
                setDescription(animal.description)
                setAlertMessage('Invalid description. Description must be a string between 10 and 200 characters.')
                setTimeout(alertReset, 2000)
                throw(Error('validation errors'))
        })
        .then(data => {
          animal.description = description
            console.log(data)
        })
        .catch(error => console.error('Error:', error))
    }
    setEdit(!prevEdit)
}

  return (
    <div className="animalCard">
      <h1 className='cardTitle'>{animal.name}</h1>
      <span className='container'>
        <button onClick={handleArrowLeft}>&lt;</button>
        {animal.photographs.length ? <img src={animal.photographs[photoIndex].image} alt={animal.name}/> : <img src={noImage} alt='no_photo'/>}
        <button onClick={handleArrowRight}>&gt;</button>
        <ul className='listText'>
            <h4>Found in:</h4>
            {animal.locations.map(location => <li key = {location}>{location}</li>)}
        </ul>
      </span>
      {edit ? <textarea className='edit' rows="5" cols="69" value={description?description:''} onChange={(e) => handleDescriptionChange(e.target.value)}/> : <p className='description'>{description}</p>}
      <button onClick={() => handleEdit()}>{edit ? 'Save': 'Edit'}</button>
      {alertMessage!==''? <p className='badAlert'>{alertMessage}</p>: <></>}
    </div>
  );
}

export default Animal;