import React, {useState, useEffect} from 'react'
import Card from "./Card.js"

function Cards({artists, sets, cards}) {
  const [filteredCards, setFilteredCards] = useState(cards)
  const [artistFilter, setArtistFilter] = useState('select')
  const [setFilter, setSetFilter] = useState('select')

  useEffect(() => {
    filterCards();
  }, [artistFilter, setFilter]);

  function filterCards() {
    let filtered = cards
    if(artistFilter !== 'select'){
      filtered = (cards.filter(card => card.artist.name === artistFilter))
      if(setFilter !== 'select')
        filtered = filtered.filter(card => card.set.name === setFilter)
    }
    else if(setFilter !== 'select')
      filtered = cards.filter(card => card.set.name === setFilter)
    setFilteredCards(filtered)
  }

  return (
    <div className='animals'>
      <label htmlFor='artist'>Artist: </label>
        <select id="artist" name="artist" value={artistFilter} onChange={e=>setArtistFilter(e.target.value)}>
            <option value={'select'}>Select Artist</option>
            {artists.map((artist) => (
                <option key={artist.id} value={artist.name}>{artist.name}</option>
            ))}
        </select>
      <label htmlFor='set'>Set: </label>
        <select id="set" name="set" value={setFilter} onChange={e=>setSetFilter(e.target.value)}>
          <option value={'select'}>Select Set</option>
          {sets.map((set) => (
              <option key={set.id} value={set.name}>{set.name}</option>
          ))}
        </select>
      <section className="container">
        {filteredCards.map((card) => (
          <Card key = {card.id} card = {card}/>
        ))}
      </section>
    </div>
  );
}

export default Cards;