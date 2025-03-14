import {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

function Card({ cardData, handleDelete }) {
    const [card, setCard] = useState(cardData);
    const [artists, setArtists] = useState([])
    const [sets, setSets] = useState([])
    const [edit, setEdit] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertClass, setAlertClass] = useState('positiveAlert')

    function alertReset() {
        setAlertMessage('');
        formik.setErrors({});
    }

    function handleAlert(message, aClass){
        setAlertClass(aClass)
        setAlertMessage(message)
        setTimeout(alertReset, 2000)
    }

    //When the edit button is switched on, fetch artists and sets to choose from
    function handleEdit(){
        fetch("/artists")
        .then(response => {
            if (!response.ok)
                throw new Error('Network response was not ok');
            return response.json();
        })
        .then(json => setArtists(json))
        .catch(error => handleAlert(error.message, 'negativeAlert'));

        fetch("/sets")
        .then(response => {
            if (!response.ok)
                throw new Error('Network response was not ok');
            return response.json();
        })
        .then(json => setSets(json))
        .catch(error => handleAlert(error.message, 'negativeAlert'));      

        setEdit(!edit)
    }

    const formSchema = yup.object().shape({
        name: yup.string().required('Card must be named.').max(30),
        art: yup.string().required('Must link an image.'),
        artist: yup.string()
        .required('Card must have an artist.')
        .notOneOf(['select'], 'Please select a valid artist.')
        .max(30),
        set: yup.string()
        .required('Card must belong to a set.')
        .notOneOf(['select'], 'Please select a valid set.')
        .max(30),
    });

    const formik = useFormik({
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: {
            name: card.name,
            art: card.art,
            artist: card.artist.name,
            set: card.set.name,
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
        }, 2000);
        }

        return validationErrors;
    },
    onSubmit: async (values) => {
        setEdit(!edit);
        try {
        const response = await fetch('/cards', {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            id: card.id,
            name: values.name,
            art: values.art,
            artist: values.artist,
            set: values.set,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            formik.resetForm();
            console.error('Validation error:', errorData);
            handleAlert(errorData.message, 'negativeAlert');
            return;
        }
        const data = await response.json();
        setCard(data);

        formik.resetForm();
        handleAlert('Card edited!', 'positiveAlert');
        } catch (error) {
            console.error('Network Error or unexpected issue:', error);
            handleAlert(error.message, 'negativeAlert');
        }
    },
    });

    return (
        <div className="card">
        {edit ? (
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className="cardError">{formik.errors.name}</div>
                ) : null}

                <label htmlFor="art">Art: </label>
                <input
                    type="text"
                    id="art"
                    name="art"
                    value={formik.values.art}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.art && formik.errors.art ? (
                    <div className="cardError">{formik.errors.art}</div>
                ) : null}

                <label htmlFor="artist">Artist: </label>
                <select
                    id="artist"
                    name="artist"
                    value={formik.values.artist}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value={'select'}>Select Artist</option>
                    {artists.map((artist) => (
                    <option key={artist.id} value={artist.name}>
                        {artist.name}
                    </option>
                    ))}
                </select>
                {formik.touched.artist && formik.errors.artist ? (
                    <div className="cardError">{formik.errors.artist}</div>
                ) : null}

                <label htmlFor="set">Set: </label>
                <select
                    id="set"
                    name="set"
                    value={formik.values.set}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value={'select'}>Select Set</option>
                    {sets.map((set) => (
                    <option key={set.id} value={set.name}>
                        {set.name}
                    </option>
                    ))}
                </select>
                {formik.touched.set && formik.errors.set ? (
                    <div className="cardError">{formik.errors.set}</div>
                ) : null}

                <button type="submit" className="submitButton">Submit</button>
                <button onClick={e => setEdit(false)} className="submitButton">Cancel</button>
            </form>
        ) : (
            <>
            <h1>{card.name}</h1>
            <img src={card.art} alt={'art unavailable'} />
            <p className="artistName">{card.artist.name}</p>
            <p className="setName">{card.set.name}</p>

            <button className='submitButton' onClick={e => handleEdit()}>Edit</button>
            <button className='submitButton'onClick={() => handleDelete(card.id)}>Remove from collection</button>
            {alertMessage !== '' ? (
                <p className={alertClass}>{alertMessage}</p>
            ) : null}
            </>
        )}
        </div>
    );
}

export default Card;