import React, {useState, useEffect} from 'react'
import LibCard from './LibCard.js';

function CardLibrary() {
    const [artists, setArtists] = useState([]);
    const [sets, setSets] = useState([]);
    const [currentView, setCurrentView] = useState('none');
    const [selectedArtist, setSelectedArtist] = useState();
    const [selectedSet, setSelectedSet] = useState();

    useEffect(() => {
        fetch('/artists')
        .then((r) => r.json())
        .then((json) => setArtists(json));
        fetch('/sets')
        .then((r) => r.json())
        .then((json) => setSets(json));
    }, []);
  
    function handleArtistSelect(id){
        setSelectedArtist(artists.find(artist => artist.id === id));
        setCurrentView('artistSelected');
    }

    function handleSetSelect(id){
        setSelectedSet(sets.find(set => set.id === id));
        setCurrentView('setSelected');
    }

    const handleViewChange = (view) => {
      setCurrentView(view);
    };

    const renderContent = () => {
        switch (currentView) {
            case 'artist':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('none')}>Back</button>
                        {artists.map((artist) => (
                            <button className='sortButton' onClick={() => handleArtistSelect(artist.id)} key={artist.id}>{`${artist.name} (${artist.cards.length})`}</button>
                        ))}
                    </>
                );
            case 'set':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('none')}>Back</button>
                        {sets.map((set) => (
                            <button className='sortButton' onClick={() => handleSetSelect(set.id)} key={set.id}>{`${set.name} (${set.cards.length})`}</button>
                        ))}
                    </>
                );
            case 'artistSelected':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('artist')}>Back</button>
                        <div className='cardsContainer'>
                            {selectedArtist.cards.map((card) => <LibCard key={card.name} card={card}/>)}
                        </div>
                    </>
                )
            case 'setSelected':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('set')}>Back</button>
                        <div className='cardsContainer'>
                            {selectedSet.cards.map((card) => <LibCard key={card.name} card={card}/>)}
                        </div>
                    </>
                )
            case 'none':
            default:
                return (
                    <>
                        <button className='sortButton' onClick={() => handleViewChange('artist')}>{`View Artists (${artists.length})`}</button>
                        <button className='sortButton' onClick={() => handleViewChange('set')}>{`View Sets (${sets.length})`}</button>
                    </>
                );
            }
    };
  
    return (
        <div className='bigContainer'>
            <h2>Library</h2>
            <p>This is a collection of all cards uploaded to the CardScuffle organizer, feel free to add to your collection!</p>
            {renderContent()}
        </div>
    );
}
  
export default CardLibrary;