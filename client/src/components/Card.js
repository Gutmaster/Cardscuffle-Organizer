import {useState} from "react";
import {useFormik} from "formik";
import * as yup from "yup"

const noImage = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shoshinsha-design.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fnoimage-760x460.png&f=1&nofb=1&ipt=d872ea62b4b151bf09b2fbf210849cba33aa79c637b5c2ce34dd1d2399081e1b&ipo=images'

function Card({card, artists, sets}) {
  const [edit, setEdit] = useState(false)
  let prevEdit = edit
  const [alertMessage, setAlertMessage] = useState('')

  function alertReset(){
      setAlertMessage('')
  }

  function handleEdit(){
    prevEdit = edit
    setEdit(!prevEdit)
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
          console.log("SUMBITING")
          setEdit(!edit)
            try {
                const response = await fetch('/_cards', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: card.id,
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

  console.log(artists, sets)

  return (
    <>
    {edit ? 
      <div className="animalCard">
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
      </div>:     
      <div className="animalCard">
        <h1 className='cardTitle'>{card.name}</h1>
        <span className='container'>
          <img src={card.art ? card.art: noImage} alt={card.name}/>
        </span>

        <p className='artistName'>{card.artist.name}</p>                                 
        <p className='setName'>{card.set.name}</p>

        <button onClick={() => handleEdit()}>{edit ? 'Save': 'Edit'}</button>
        {alertMessage!==''? <p className='badAlert'>{alertMessage}</p>: <></>}
      </div>
      
    }
    </>
  );
}

export default Card;

// return (
//   <div className='signUp'>

//       {alertMessage!==''? <p className='goodAlert'>{alertMessage}</p>: <></>}

//       {addArtist ?  
//           <form onSubmit={handleArtistSubmit}>
//               <input type="text" value={newArtist} onChange={e => setNewArtist(e.target.value)}/>
//               <button type="submit" className='submitButton'>Submit</button>
//           </form> :
//           <button onClick={e => setAddArtist(!addArtist)}>Add Artist</button>}

//       {addSet ?
//           <form onSubmit={handleSetSubmit}>
//               <input type="text" value={newSet} onChange={e => setNewSet(e.target.value)}/>
//               <button type="submit" className='submitButton'>Submit</button>
//           </form> :
//           <button onClick={e => setAddSet(!addSet)}>Add Set</button>}
//   </div>
// );
// }



  // function handleEdit() {
  //   prevEdit = edit
  //   if (prevEdit)
  //   {
  //       fetch(`/cards/${card.id}`, {
  //           method: 'PATCH',
  //           headers: {
  //               'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({name: card.name, 
  //                                 art: card.art,
  //                                 artist: card.artist,
  //                                 set: card.set})
  //       })
  //       .then(response => {
  //           if(response.ok)
  //               return response.json()
  //           else
  //               // setAlertMessage('Invalid description. Description must be a string between 10 and 200 characters.')
  //               // setTimeout(alertReset, 2000)
  //               throw(Error('validation errors'))
  //       })
  //       .then(data => {
  //           console.log(data)
  //       })
  //       .catch(error => console.error('Error:', error))
  //   }
  //   setEdit(!prevEdit)
  // }