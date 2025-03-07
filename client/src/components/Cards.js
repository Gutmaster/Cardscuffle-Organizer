import React, {useState, useEffect, useCallback} from 'react'
import Card from "./Card.js"

function Cards({artists, sets, user, setUser}) {
  const [filteredCards, setFilteredCards] = useState([])
  const [artistFilter, setArtistFilter] = useState('select')
  const [setFilter, setSetFilter] = useState('select')
  const [userArtists, setUserArtists] = useState([])
  const [userSets, setUserSets] = useState([])

  const filterCards = useCallback(() => {
    let filtered = []
    let selectedArtist = userArtists.find(artist => artist.id === parseInt(artistFilter))
    let selectedSet = userSets.find(set => set.id === parseInt(setFilter))
    
    if(selectedArtist && artistFilter !== 'select'){
      filtered = selectedArtist.cards
      if(selectedSet && setFilter !== 'select')
        filtered = filtered.filter(card => card.set.name === selectedSet.name)
    }
    else if(selectedSet && setFilter !== 'select')
      filtered = selectedSet.cards
    setFilteredCards(filtered)
  }, [artistFilter, setFilter, userArtists, userSets])

  useEffect(() => {
    fetch("/_userartistsandsets")
    .then((r) => r.json())
    .then(json => {
      setUserArtists(json.artists)
      setUserSets(json.sets)
    })
  }, [user]);

  useEffect(() => {
    filterCards();
  }, [filterCards]);

  function handleDelete(id) {
    fetch('_users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card_id: id }),
    })
    .then((r) => r.json())
    .then((json) => setUser(json))
    .catch((error) => {
      console.error("Error:", error);
    });
  }


  return (
    <div className='animals'>
      <label htmlFor='artist'>Artist: </label>
        <select id="artist" name="artist" value={artistFilter} onChange={e=>setArtistFilter(e.target.value)}>
            <option value={'select'}>Select Artist</option>
            {userArtists.map((artist) => (
                <option key={artist.id} value={artist.id}>{artist.name}</option>
            ))}
        </select>
      <label htmlFor='set'>Set: </label>
        <select id="set" name="set" value={setFilter} onChange={e=>setSetFilter(e.target.value)}>
          <option value={'select'}>Select Set</option>
          {userSets.map((set) => (
              <option key={set.id} value={set.id}>{set.name}</option>
          ))}
        </select>
      <section className="container">
        {filteredCards.map((card) => (
          <Card key={card.id} cardData={card} artists={artists} sets={sets} handleDelete={handleDelete}/>
        ))}
      </section>
    </div>
  );
}

export default Cards;