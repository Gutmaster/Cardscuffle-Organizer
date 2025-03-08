import React, {useState, useEffect, useCallback} from 'react'
import Card from "./Card.js"

function Cards({artists, sets, user, setUser}) {
  const [filteredCards, setFilteredCards] = useState([])
  const [artistFilter, setArtistFilter] = useState('select')
  const [setFilter, setSetFilter] = useState('select')
  const [userCards, setUserCards] = useState([])
  const [userArtists, setUserArtists] = useState([])
  const [userSets, setUserSets] = useState([])

  const filterCards = useCallback(() => {
    let filtered = userCards
    console.log(artistFilter, setFilter)
    if(artistFilter !== 'select'){
      filtered = filtered.filter(card => card.artist.name === artistFilter)
      if(setFilter !== 'select')
        filtered = filtered.filter(card => card.set.name === setFilter)
    }
    else if(setFilter !== 'select')
      filtered = filtered.filter(card => card.set.name === setFilter)
    setFilteredCards(filtered)
  }, [artistFilter, setFilter, userArtists, userSets])

  useEffect(() => {
    fetch("/_usercards")
    .then((r) => r.json())
    .then(json => {
      setUserCards(json)

      const artists = new Set();
      const sets = new Set();
      
      json.forEach(card => {
        if (card.artist)
          artists.add(card.artist.name);
        if (card.set)
          sets.add(card.set.name);
      });
      setUserArtists([...artists]);
      setUserSets([...sets]);
    })
  }, [user]);

  useEffect(() => {
    filterCards();
  }, [user, filterCards]);

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
                <option key={artist} value={artist}>{artist}</option>
            ))}
        </select>
      <label htmlFor='set'>Set: </label>
        <select id="set" name="set" value={setFilter} onChange={e=>setSetFilter(e.target.value)}>
          <option value={'select'}>Select Set</option>
          {userSets.map((set) => (
              <option key={set} value={set}>{set}</option>
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