import {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

function Card({ cardData, artists, sets, handleDelete }) {
  const [card, setCard] = useState(cardData);
  const [edit, setEdit] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  function alertReset() {
    setAlertMessage('');
  }

  function handleEdit() {
    setEdit(!edit);
  }

  const formSchema = yup.object().shape({
    name: yup.string().required('Card must be named.').max(30),
    art: yup.string().required('Must link an image.'),
    artist: yup.string().required('Card must have an artist.').max(30),
    set: yup.string().required('Card must belong to a set.').max(30),
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
    onSubmit: async (values) => {
      setEdit(!edit);
      try {
        const response = await fetch('/_cards', {
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
          console.error('Validation error:', errorData);
          return;
        }
        const data = await response.json();
        setCard(data);

        formik.resetForm();
        setAlertMessage('Card edited!');
        setTimeout(alertReset, 2000);
      } catch (error) {
        console.error('Network Error or unexpected issue:', error);
      }
    },
  });

  return (
    <>
      {edit ? (
        <div className="card">
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <label htmlFor="art">Art: </label>
            <input
              type="text"
              id="art"
              name="art"
              value={formik.values.art}
              onChange={formik.handleChange}
            />
            <label htmlFor="artist">Artist: </label>
            <select
              id="artist"
              name="artist"
              value={formik.values.artist}
              onChange={formik.handleChange}
            >
              <option value={'select'}>Select Artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.name}>
                  {artist.name}
                </option>
              ))}
            </select>
            <label htmlFor="set">Set: </label>
            <select
              id="set"
              name="set"
              value={formik.values.set}
              onChange={formik.handleChange}
            >
              <option value={'select'}>Select Set</option>
              {sets.map((set) => (
                <option key={set.id} value={set.name}>
                  {set.name}
                </option>
              ))}
            </select>
            <button type="submit" className="submitButton">Submit</button>
            <button onClick={e=>setEdit(false)} className="submitButton">Cancel</button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h1 className="cardTitle">{card.name}</h1>
          <span className="container">
            <img src={card.art} alt={'art unavailable'} />
          </span>

          <p className="artistName">{card.artist.name}</p>
          <p className="setName">{card.set.name}</p>

          <button onClick={handleEdit}>{edit ? 'Save' : 'Edit'}</button>
          <button onClick={() => handleDelete(card.id)}>Remove from collection</button>
          {alertMessage !== '' ? (
            <p className="badAlert">{alertMessage}</p>
          ) : null}
        </div>
      )}
    </>
  );
}

export default Card