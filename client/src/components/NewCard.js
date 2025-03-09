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
                const data = await response.json();
                formik.resetForm();
                setAlertMessage('Card added!');
                setTimeout(alertReset, 2000);
            } catch (error) {
                // This block will catch network errors and other unexpected issues
                console.error('Network Error or unexpected issue:', error);
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
                name: newArtist,
            }, null, 2)
        })
    }

    function handleSetSubmit(){
        fetch('/_sets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newSet,
                year: 2015,
                month: 2,
                day: 1
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

            {addSet ?
                <form onSubmit={handleSetSubmit}>
                    <input type="text" value={newSet} onChange={e => setNewSet(e.target.value)}/>
                    <button type="submit" className='submitButton'>Submit</button>
                </form> :
                <button onClick={e => setAddSet(!addSet)}>Add Set</button>}
        </div>
    );
}

export default NewCard;