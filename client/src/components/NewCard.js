import React, {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

function NewCard({artists, sets}) {
    const [alertMessage, setAlertMessage] = useState('')
    const [addArtist, setAddArtist] = useState(false)
    const [addSet, setAddSet] = useState(false)
    const [newArtist, setNewArtist] = useState('')
    const [newSet, setNewSet] = useState('')

    function alertReset(){
        setAlertMessage('')
    }

    const formSchema = yup.object().shape({
        name: yup.string().required("Card must be named.").max(30),
        art: yup.string().required("Must link an image."),
        artist: yup.string().required("Card must have an artist.").max(30),
        set: yup.string().required("Card must belong to a set.").max(30),
    })

    const formik = useFormik({
        validateOnChange : false,
        validateOnBlur : false,
        initialValues: {
            name: "",
            art: "",
            artist: "",
            set: "",
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch('/_cards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: values.name,
                        art: values.art,
                        artist: values.artist,
                        set: values.set,
                    }, null, 2)
                })
                if (!response.ok) {
                    // This block will catch non-200-level HTTP responses
                    const errorData = await response.json()
                    console.error('Validation error:', errorData)
                    return
                }
                const data = await response.json()
                //setPhotos([...photos, data])
                console.log("REMEMBER TO SET CARD STATE")
                formik.values.name = ''
                formik.values.art = ''
                formik.values.artist = 'select'
                formik.values.set = 'select'
                setAlertMessage('Card added!')
                setTimeout(alertReset, 2000)
            } catch (error) {
                // This block will catch network errors and other unexpected issues
                console.error('Network Error or unexpected issue:', error)
            }
        }
    })

    function handleArtistSubmit(){
        fetch('/_artists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newArtist
            }, null, 2)
        })
    }

    return (
        <div className='signUp'>
            <form className='' onSubmit={formik.handleSubmit}>
                <label htmlFor='name'>Name: </label>
                    <input type="text" id = "name" name="name" value={formik.values.name} onChange={formik.handleChange}/>
                <label htmlFor='art'>Art: </label>
                    <input type="text" id = "art" name="art" value={formik.values.art} onChange={formik.handleChange}/>
                <label htmlFor='artist'>Artist: </label>
                    <select id="artist" name="artist" value={formik.values.artist} onChange={formik.handleChange}>
                        <option value={'select'}>Select Artist</option>
                        {artists.map((artist) => (
                            <option key={artist.id} value={artist.name}>{artist.name}</option>
                        ))}
                    </select>
                <label htmlFor='set'>Set: </label>
                    <select id="set" name="set" value={formik.values.set} onChange={formik.handleChange}>
                        <option value={'select'}>Select Set</option>
                        {sets.map((set) => (
                            <option key={set.id} value={set.name}>{set.name}</option>
                        ))}
                    </select>
                <button type="submit" className='submitButton'>Submit</button>
            </form>
            {alertMessage!==''? <p className='goodAlert'>{alertMessage}</p>: <></>}

            {addArtist ?  
                <form onSubmit={handleArtistSubmit}>
                    <input type="text" value={newArtist} onChange={e => setNewArtist(e.target.value)}/>
                    <button type="submit" className='submitButton'>Submit</button>
                </form> :
                <button onClick={e => setAddArtist(!addArtist)}>Add Artist</button>}

            {addSet?
                <form>
                    <input type="text" value={newSet} onChange={e => setNewSet(e.target.value)}/>
                    <button type="submit" className='submitButton'>Submit</button>
                </form> :
                <button onClick={e => setAddSet(!addSet)}>Add Set</button>}
        </div>
    );
}

{/* <div className='newPhoto'>
<form className='newPhotoForm' onSubmit={formik.handleSubmit}>
    <div className='left'>
        <label htmlFor='animal'>Animal: </label>
            <select id="animal" name="animal" value={formik.values.animal} onChange={formik.handleChange}>
                <option value={'select'}>Select Animal</option>
                {animals.map((animal) => (
                    <option key={animal.id} value={animal.name}>{animal.name}</option>
                ))}
                <option value={'newAnimal'}>New Animal</option>
            </select>

        <label htmlFor='location'>Location: </label>
            <select id="location" name="location" value={formik.values.location} onChange={formik.handleChange}>
                <option value={'select'}>Select Location</option>
                {locations.map((location) => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                ))}
                <option value={'newLocation'}>New Location</option>
            </select>

        <label htmlFor='image'>Image URL: </label>
            <input type="text" id = "image" name="image" value={formik.values.image} onChange={formik.handleChange}/>
    </div>
    <div className='right'>
        {formik.values.animal === 'newAnimal' ? <input type="text" id = "newAnimal" name="newAnimal" value={formik.values.newAnimal} onChange={formik.handleChange}/> : <input type="text" readOnly={true} value={''} style = {{visibility: 'hidden'}}/>}
        {formik.values.location === 'newLocation' ? <input type="text" id = "newLocation" name="newLocation" value={formik.values.newLocation} onChange={formik.handleChange}/> : <input type="text" readOnly={true} value={''} style = {{visibility: 'hidden'}}/>}
    </div>  
    <button type="submit" className='submitButton'>Submit</button>
</form>
{alertMessage!==''? <p className='goodAlert'>{alertMessage}</p>: <></>}
</div> */}

export default NewCard;