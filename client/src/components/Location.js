import React, {useState} from "react";

const noImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shoshinsha-design.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fnoimage-760x460.png&f=1&nofb=1&ipt=d872ea62b4b151bf09b2fbf210849cba33aa79c637b5c2ce34dd1d2399081e1b&ipo=images'

function Location({location}) {
    const [photoIndex, setPhotoIndex] = useState(0)
    const [edit, setEdit] = useState(false)
    let prevEdit = edit
    const [description, setDescription] = useState(location.description)

    function handleArrowRight(e) {
        e.preventDefault()
        setPhotoIndex((photoIndex + 1) % location.photographs.length)
    }
    function handleArrowLeft(e) {
        e.preventDefault()
        setPhotoIndex((photoIndex - 1 + location.photographs.length) % location.photographs.length)
    }

    function handleEdit() {
        prevEdit = edit
        if (prevEdit)
        {
            fetch(`/_locations/${location.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: location.name, description: description})
            })
            .then(response => {
                if(response.ok)
                    return response.json()
                else
                    setDescription(location.description)
                    throw(Error('validation errors'))
            })
            .then(data => {
                location.description = description
                console.log(data)
            })
            .catch(error => console.error('Error:', error))
        }
        setEdit(!prevEdit)
    }

    return (
        <div className="locationCard">
            <h1 className='cardTitle'>{location.name}</h1>
            <span className='container'>
                <button onClick={handleArrowLeft}>&lt;</button>
                {location.photographs.length ? <img src={location.photographs[photoIndex].image} alt={location.name}/> : <img src={noImage} alt='no_photo'/>}
                <button onClick={handleArrowRight}>&gt;</button>
                <ul className='listText'>
                    <h4>Residents:</h4>
                    {location.animals.map(animal => <li key = {animal}>{animal}</li>)}
                </ul>
            </span>
            {edit ? <textarea className='edit' rows="5" cols="69" value={description} onChange={(e) => setDescription(e.target.value)}/> : <p className='description'>{description}</p>}
            <button onClick={() => handleEdit()}>{edit ? 'Save': 'Edit'}</button>
        </div>
    );
}

export default Location;