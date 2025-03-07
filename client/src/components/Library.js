import React, {useState, useEffect, useCallback} from 'react'
import LibCard from "./LibCard.js"


function Library({artists, sets, user}) {
    const [library, setLibrary] = useState([])
    const [filteredCards, setFilteredCards] = useState([])
    const [artistFilter, setArtistFilter] = useState('select')
    const [setFilter, setSetFilter] = useState('select')

    const filterCards = useCallback(() => {
        let filtered = []
        let selectedArtist = artists.find(artist => artist.id === parseInt(artistFilter))
        let selectedSet = sets.find(set => set.id === parseInt(setFilter))
        if(artistFilter !== 'select'){
            console.log("artistfilter", selectedArtist.cards)
            filtered = selectedArtist.cards
            if(setFilter !== 'select')
            filtered = filtered.filter(card => card.set.name === selectedSet.name)
        }
        else if(setFilter !== 'select')
            filtered = selectedSet.cards
        else
            filtered = library
        console.log(filtered)
        setFilteredCards(filtered)
    }, [artistFilter, setFilter, artists, sets, library])
    
    useEffect(() => {
        fetch("/_library")
        .then((r) => r.json())
        .then(json => {
            setLibrary(json)
            setFilteredCards(json)
        })
    }, [])

    useEffect(() => {
        filterCards()
    }, [filterCards])

    return (
        <div className='animals'>
            <label htmlFor='artist'>Artist: </label>
            <select id="artist" name="artist" value={artistFilter} onChange={e=>setArtistFilter(e.target.value)}>
                <option value={'select'}>Select Artist</option>
                {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                ))}
            </select>
            <label htmlFor='set'>Set: </label>
            <select id="set" name="set" value={setFilter} onChange={e=>setSetFilter(e.target.value)}>
                <option value={'select'}>Select Set</option>
                {sets.map((set) => (
                    <option key={set.id} value={set.id}>{set.name}</option>
                ))}
            </select>
            <section className="container">
            {filteredCards.map((card) => (
                <LibCard key={card.id} card={card} user={user}/>
            ))}
            </section>
        </div>
        );
    }

    export default Library
