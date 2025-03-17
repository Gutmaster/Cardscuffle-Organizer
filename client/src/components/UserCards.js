import React, {useState, useContext} from 'react'
import UserContext from './context/user.js';
import Card from './Card.js';

function UserCards() {
    const [currentView, setCurrentView] = useState('none');
    const [selectedArtist, setSelectedArtist] = useState();
    const [selectedSet, setSelectedSet] = useState();
    const {user} = useContext(UserContext);

    // function handleDelete(id) {
    //     fetch('users', {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //     },
    //         body: JSON.stringify({ card_id: id }),
    //     })
    //     .then((r) => r.json())
    //     .then((json) => setUser(json))
    //     .catch((error) => {
    //         console.error("Error:", error);
    //     });
    // }

    function handleArtistSelect(id){
        setSelectedArtist(user.artists.find(artist => artist.id === id));
        setCurrentView('artistSelected');
    }

    function handleSetSelect(id){
        setSelectedSet(user.sets.find(set => set.id === id));
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
                    {user.artists.map((artist) => (
                        <button className='sortButton' onClick={() => handleArtistSelect(artist.id)} key={artist.id}>{artist.name}</button>
                    ))}
                </>
            );
        case 'set':
            return (
                <>
                    <button className='backButton' onClick={() => handleViewChange('none')}>Back</button>
                    {user.sets.map((set) => (
                        <button className='sortButton' onClick={() => handleSetSelect(set.id)} key={set.id}>{set.name}</button>
                    ))}
                </>
            );
        case 'artistSelected':
            return (
                <>
                    <button className='backButton' onClick={() => handleViewChange('artist')}>Back</button>
                    {selectedArtist.cards.map((card) => <Card key={card.name} cardData={card}/>)}
                </>
            )
        case 'setSelected':
            return (
                <>
                    <button className='backButton' onClick={() => handleViewChange('set')}>Back</button>
                    {selectedSet.cards.map((card) => <Card key={card.name} cardData={card}/>)}
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
  
  export default UserCards;