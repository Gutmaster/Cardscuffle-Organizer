import React, {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

function NewPhoto({animals, locations, photos, setPhotos}) {
    const [alertMessage, setAlertMessage] = useState('')

    function alertReset(){
        setAlertMessage('')
    }

    const formSchema = yup.object().shape({
        animal: yup.string().required("Must enter species name.").max(30),
        newAnimal: yup.string(),
        location: yup.string().required("Must enter location name.").max(30),
        newLocation: yup.string(),
        image: yup.string().required("Must link an image.")
    })

    const formik = useFormik({
        validateOnChange : false,
        validateOnBlur : false,
        initialValues: {
            animal: "",
            newAnimal: "",
            location: "",
            newLocation: "",
            image: "",
        },
        validationSchema: formSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch('/_photographs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        animal_name: values.animal === 'newAnimal' ? values.newAnimal : values.animal,
                        location_name: values.location === 'newLocation' ? values.newLocation : values.location,
                        image: values.image
                    }, null, 2)
                })
                if (!response.ok) {
                    // This block will catch non-200-level HTTP responses
                    const errorData = await response.json()
                    console.error('Validation error:', errorData)
                    return
                }
                const data = await response.json()
                setPhotos([...photos, data])
                formik.values.animal = 'select'
                formik.values.newAnimal = ''
                formik.values.location = 'select'
                formik.values.newLocation = ''
                formik.values.image = ''
                setAlertMessage('Photo added!')
                setTimeout(alertReset, 2000)
            } catch (error) {
                // This block will catch network errors and other unexpected issues
                console.error('Network Error or unexpected issue:', error)
            }
        }
    })

    return (
        <div className='newPhoto'>
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
        </div>
    );
}

export default NewPhoto;