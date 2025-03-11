import React, {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

function NewCard({artists, sets, setArtists, setSets}) {
    const [alertMessage, setAlertMessage] = useState('')
    const [alertClass, setAlertClass] = useState('')
    const [addArtist, setAddArtist] = useState(false)
    const [addSet, setAddSet] = useState(false)
    const [newArtist, setNewArtist] = useState('')
    const [newSet, setNewSet] = useState('')
    const [date, setDate] = useState('')

    function alertReset(){
        setAlertMessage('');
    }

    function handleAlert(message, aClass){
        setAlertClass(aClass)
        setAlertMessage(message)
        setTimeout(alertReset, 3000)
    }
    
    const formSchema = yup.object().shape({
        name: yup.string().required("Card must be named and under 30 characters.").max(30),
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
        validate: (values) => {
            // Use Yup's validation method
            const validationErrors = {};
            try {
              formSchema.validateSync(values, { abortEarly: false });
            } catch (err) {
              err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
              });
            }
      
            // Set a timer to clear errors after 3 seconds
            if (Object.keys(validationErrors).length > 0) {
              setTimeout(() => {
                formik.setErrors({});
              }, 3000);
            }
      
            return validationErrors;
        },
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
                    handleAlert(errorData.message, 'negativeAlert');
                    return
                }
                
                formik.resetForm();
                handleAlert('Card added!', 'positiveAlert');
            } catch (error) {
                // This block will catch network errors and other unexpected issues
                console.error('Network Error or unexpected issue:', error);
                handleAlert(error.message, 'negativeAlert');
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
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(json => setArtists([...artists, json]))
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            handleAlert(error.message, 'negativeAlert');
        });
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
        .then(response => {
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(json => setSets([...sets, json]))
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            handleAlert(error.message, 'negativeAlert');
        });
    }
      
    return (
        <div className='signUp'>
            {(!addArtist && !addSet) ? (
                <>
                    <form className='' onSubmit={formik.handleSubmit}>
                        <label htmlFor='name'>Name: </label>
                        <input 
                            type="text" 
                            id = "name" name="name" 
                            value={formik.values.name} 
                            onChange={formik.handleChange}
                            required
                        />
                        {formik.errors.name && <div>{formik.errors.name}</div>}

                        <label htmlFor='art'>Art: </label>
                        <input 
                            type="text" 
                            id = "art" name="art" 
                            value={formik.values.art} 
                            onChange={formik.handleChange}
                            required
                        />
                        {formik.errors.art && <div>{formik.errors.art}</div>}

                        <label htmlFor='artist'>Artist: </label>
                        <select 
                            id="artist" 
                            name="artist" 
                            value={formik.values.artist} 
                            onChange={formik.handleChange}
                        >
                            <option value={'select'}>Select Artist</option>
                            {artists.map((artist) => (
                                <option key={artist.id} value={artist.name}>{artist.name}</option>
                            ))}
                        </select>
                        {formik.errors.artist && <div>{formik.errors.artist}</div>}

                        <label htmlFor='set'>Set: </label>
                        <select 
                            id="set" 
                            name="set" 
                            value={formik.values.set} 
                            onChange={formik.handleChange}
                        >
                            <option value={'select'}>Select Set</option>
                            {sets.map((set) => (
                                <option key={set.id} value={set.name}>{set.name}</option>
                            ))}
                        </select>
                        {formik.errors.set && <div>{formik.errors.set}</div>}

                        <button type="submit" className='submitButton'>Submit</button>
                    </form>

                    <button onClick={() => setAddArtist(!addArtist)}>Add Artist</button>
                    <button onClick={() => setAddSet(!addSet)}>Add Set</button>
                    {alertMessage!==''? <p className={alertClass}>{alertMessage}</p>: <></>}
                </>
            ) : (
                <>
                    {addArtist ? (
                        <form onSubmit={handleArtistSubmit}>
                            <input 
                                type="text" 
                                value={newArtist} 
                                onChange={e => setNewArtist(e.target.value)} 
                                required
                            />
                            <button type="submit" className='submitButton'>Submit</button>
                            <button onClick={() => setAddArtist(!addArtist)}>Cancel</button>
                        </form>
                    ) : (
                        <></>
                    )}
    
                    {addSet ? (
                        <form onSubmit={handleSetSubmit}>
                            <div>
                                <label htmlFor="setName">Set Name:</label>
                                <input
                                    type="text"
                                    id="setName"
                                    value={newSet}
                                    onChange={e => setNewSet(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="setDate">Select Date:</label>
                                <input
                                    type="date"
                                    id="setDate"
                                    value={date}
                                    onChange={e=>setDate(e.target.value)}
                                    max={new Date().toISOString().split("T")[0]} // Today's date
                                    min="1992-01-01"
                                    required
                                />
                            </div>
                            <button type="submit" className='submitButton'>Submit</button>
                            <button type="button" onClick={() => setAddSet(!addSet)}>Cancel</button>
                        </form>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </div>
    );
}

export default NewCard;