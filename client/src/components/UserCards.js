import React, {useState, useEffect} from 'react'
import UserArtist from './UserArtist';
import UserSet from './UserSet';

function UserCards({ user, setUser }) {
    const [userArtists, setUserArtists] = useState([]);
    const [userSets, setUserSets] = useState([]);
    const [currentView, setCurrentView] = useState('none');
    const [selectedArtist, setSelectedArtist] = useState();
    const [selectedSet, setSelectedSet] = useState();

    useEffect(() => {
      fetch('/userartists')
        .then((r) => r.json())
        .then((json) => setUserArtists(json));
      fetch('/usersets')
        .then((r) => r.json())
        .then((json) => setUserSets(json));
    }, [user]);
  
    function handleArtistSelect(id){
        setSelectedArtist(userArtists.find(artist => artist.id === id));
        setCurrentView('artistSelected');
    }

    function handleSetSelect(id){
        setSelectedSet(userSets.find(set => set.id === id));
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
                    <button onClick={() => handleViewChange('none')}>Back</button>
                    {userArtists.map((artist) => (
                        <button onClick={() => handleArtistSelect(artist.id)} key={artist.id}>{artist.name}</button>
                    ))}
                </>
            );
        case 'set':
            return (
                <>
                    <button onClick={() => handleViewChange('none')}>Back</button>
                    {userSets.map((set) => (
                        <button onClick={() => handleSetSelect(set.id)} key={set.id}>{set.name}</button>
                    ))}
                </>
            );
        case 'artistSelected':
            return (
                <>
                    <button onClick={() => handleViewChange('artist')}>Back</button>
                    <UserArtist artist={selectedArtist} setUser={setUser}/>
                </>
            )
        case 'setSelected':
            return (
                <>
                    <button onClick={() => handleViewChange('set')}>Back</button>
                    <UserSet set={selectedSet} setUser={setUser}/>
                </>
            )
        case 'none':
        default:
            return (
                <>
                    <button onClick={() => handleViewChange('artist')}>View Artists</button>
                    <button onClick={() => handleViewChange('set')}>View Sets</button>
                </>
            );
      }
    };
  
    return <div className='signUp'>{renderContent()}</div>;
  }
  
  export default UserCards;