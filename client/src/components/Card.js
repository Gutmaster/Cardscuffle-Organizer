import {useState} from "react";

const noImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shoshinsha-design.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fnoimage-760x460.png&f=1&nofb=1&ipt=d872ea62b4b151bf09b2fbf210849cba33aa79c637b5c2ce34dd1d2399081e1b&ipo=images'

function Card({card}) {
  const [edit, setEdit] = useState(false)
  let prevEdit = edit
  const [alertMessage, setAlertMessage] = useState('')

  function alertReset(){
      setAlertMessage('')
  }

  function handleEdit() {
    prevEdit = edit
    if (prevEdit)
    {
        fetch(`/cards/${card.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: card.name, art: ''})
        })
        .then(response => {
            if(response.ok)
                return response.json()
            else
                setAlertMessage('Invalid description. Description must be a string between 10 and 200 characters.')
                setTimeout(alertReset, 2000)
                throw(Error('validation errors'))
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error('Error:', error))
    }
    setEdit(!prevEdit)
}

  return (
    <div className="animalCard">
      <h1 className='cardTitle'>{card.name}</h1>
      <span className='container'>

        <img src={card.art} alt={card.name}/>

      </span>
      <p className='artistName'>{card.artist.name}</p>
      <p className='setName'>{card.set.name}</p>
      {/* {edit ? <textarea className='edit' rows="5" cols="69" value={description?description:''} onChange={(e) => handleDescriptionChange(e.target.value)}/> : <p className='description'>{description}</p>}
      <button onClick={() => handleEdit()}>{edit ? 'Save': 'Edit'}</button> */}
      {alertMessage!==''? <p className='badAlert'>{alertMessage}</p>: <></>}
    </div>
  );
}

export default Card;