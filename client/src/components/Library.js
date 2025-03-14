import React, {useState, useEffect} from 'react'
import Artist from './UserArtist';
import Set from './UserSet';

function CardLibrary({ setUser }) {
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
                        <button className='sortButton' onClick={() => handleArtistSelect(artist.id)} key={artist.id}>{artist.name}</button>
                    ))}
                </>
            );
        case 'set':
            return (
                <>
                    <button className='backButton' onClick={() => handleViewChange('none')}>Back</button>
                    {sets.map((set) => (
                        <button className='sortButton' onClick={() => handleSetSelect(set.id)} key={set.id}>{set.name}</button>
                    ))}
                </>
            );
        case 'artistSelected':
            return (
                <>
                    <button className='backButton' onClick={() => handleViewChange('artist')}>Back</button>
                    <Artist artist={selectedArtist} setUser={setUser}/>
                </>
            )
        case 'setSelected':
            return (
                <>
                    <button className='backButton' onClick={() => handleViewChange('set')}>Back</button>
                    <Set set={selectedSet} setUser={setUser}/>
                </>
            )
        case 'none':
        default:
            return (
                <>
                    <button className='sortButton' onClick={() => handleViewChange('artist')}>View Artists</button>
                    <button className='sortButton' onClick={() => handleViewChange('set')}>View Sets</button>
                </>
            );
      }
    };
  
    return <div className='container'>{renderContent()}</div>;
  }
  
  export default CardLibrary;