import React, {useState, useContext} from 'react'
import UserContext from './context/user.js';
import Card from './Card.js';

function UserCards() {
    const [currentView, setCurrentView] = useState('none');
    const [selectedArtist, setSelectedArtist] = useState();
    const [selectedSet, setSelectedSet] = useState();
    const {user, setUser} = useContext(UserContext);

    const handleFormSubmit = async (values, card, setCard, handleAlert, setEdit, artists, sets) => {
        setEdit(prevEdit => !prevEdit);
        try {
            const response = await fetch('/cards', {
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
                handleAlert(errorData.message, 'negativeAlert');
                return;
            }
            const data = await response.json();
            //Fix artist and set menus
            //Find old artist and set
            const oldArtist = artists.find(a => a.id === card.artist.id)
            const oldSet = sets.find(s => s.id === card.set.id)
            const newArtist = artists.find(a => a.id ===data.artist.id)
            const newSet = sets.find(s => s.id === data.set.id)
            //find matching copies from user's artists
            const uOldArtist = user.artists.find(a => a.id === oldArtist.id)
            const uNewArtist = user.artists.find(a => a.id === newArtist.id)
            const uOldSet = user.sets.find(a => a.id === oldSet.id)
            const uNewSet = user.sets.find(a => a.id === newSet.id)

            //if they don't match
            if(oldArtist !== newArtist){
                //go back to artists view if we have selected by artist
                if(currentView === 'artistSelected')
                    handleViewChange('artist')
                //remove card from old artist
                uOldArtist.cards = uOldArtist.cards.filter(card => card.id !== data.id);
                //remove artist from user's artists if no cards remaining
                if(!uOldArtist.cards.length){
                    user.artists = user.artists.filter(a => a.id !== uOldArtist.id)
                }
                //if we have the new artist already, add the card
                if(uNewArtist)
                    uNewArtist.cards.push(data)
                else{ //otherwise overwrite cards with the new card and add to artist list
                    newArtist.cards = [data]
                    user.artists.push(newArtist)
                }
            }
            else{
                const index = uNewArtist.cards.findIndex(c => c.id === card.id);
                uNewArtist.cards[index] = data; // Replace the old card with the new data
            }

            if(oldSet !== newSet){
                //go back to sets view if we have selected by set
                if(currentView === 'setSelected')
                    handleViewChange('set')
                //remove card from old set
                uOldSet.cards = uOldSet.cards.filter(card => card.id !== data.id);
                //remove set from user's sets if no cards remaining
                if(!uOldSet.cards.length)
                    user.sets = user.sets.filter(a => a.id !== uOldSet.id)
                //if we have the new set already, add the card
                if(uNewSet)
                    uNewSet.cards.push(data)
                else{ //otherwise overwrite library copy of new set's cards with just the new card and add to artist list
                    newSet.cards = [data]
                    user.sets.push(newSet)
                }
            }
            else{
                const index = uNewSet.cards.findIndex(c => c.id === card.id);
                uNewSet.cards[index] = data; // Replace the old card with the new data
            }

            setUser(user)
            setCard(data);
            handleAlert('Card edited!', 'positiveAlert');
        } catch (error) {
            console.error('Network Error or unexpected issue:', error);
            handleAlert(error.message, 'negativeAlert');
        }
    };

    function handleRemove(card) {
        fetch('usercards', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({card_id: card.id}),
        })
        .then((r) => r.json())
        .then((json) => {
            //go back to artists view if we have selected by artist
            if(currentView === 'artistSelected')
                handleViewChange('artist')
            //go back to sets view if we have selected by set
            else if(currentView === 'setSelected')
                handleViewChange('set')

            user.cards = user.cards.filter(c => c.id !== card.id)
            //find current user's artist and set lists
            const artist = user.artists.find(a => a.id === card.artist.id);
            const set = user.sets.find(a => a.id === card.set.id);
            //remove artist from user's artists if no cards remaining
            if(!artist.cards.length){
                user.artists = user.artists.filter(a => a.id !== artist.id)
            }
            //remove set from user's sets if no cards remaining
            if(!set.cards.length)
                user.sets = user.sets.filter(a => a.id !== set.id)

            //remove card from artist and set
            artist.cards = artist.cards.filter(c => c.id !== card.id);
            set.cards = set.cards.filter(c => c.id !== card.id);
            setUser(user)
            if(json.signal_delete){
                fetch('cards', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: card.id})
                })
                .then((r) => r.json())
                .then((json) => {
                    console.log(json)
                })
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }

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
        if(!user)
            return;
        switch (currentView) {
            case 'artist':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('none')}>Back</button>
                        {user.artists.map((artist) => (
                            <button className='sortButton' onClick={() => handleArtistSelect(artist.id)} key={artist.id}>{`${artist.name} (${artist.cards.length})`}</button>
                        ))}
                    </>
                );
            case 'set':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('none')}>Back</button>
                        {user.sets.map((set) => (
                            <button className='sortButton' onClick={() => handleSetSelect(set.id)} key={set.id}>{`${set.name} (${set.cards.length})`}</button>
                        ))}
                    </>
                );
            case 'artistSelected':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('artist')}>Back</button>
                        <div className='cardsContainer'>
                            {selectedArtist.cards.map((card) => <Card key={card.name} cardData={card} handleRemove={handleRemove} onSubmit={handleFormSubmit}/>)}
                         </div>
                    </>
                )
            case 'setSelected':
                return (
                    <>
                        <button className='backButton' onClick={() => handleViewChange('set')}>Back</button>
                        <div className='cardsContainer'>
                            {selectedSet.cards.map((card) => <Card key={card.name} cardData={card} handleRemove={handleRemove} onSubmit={handleFormSubmit}/>)}
                        </div>
                    </>
                )
            case 'none':
            default:
                return (
                    <>
                        <button className='sortButton' onClick={() => handleViewChange('artist')}>{`View Artists (${user.artists.length})`}</button>
                        <button className='sortButton' onClick={() => handleViewChange('set')}>{`View Sets (${user.sets.length})`}</button>
                    </>
                );
        }
    };
    return (
        <div className='bigContainer'>
            <h2>My Collection</h2>
            <p>These are all of the cards you've uploaded yourself or added to your collection from the library. Feel free to update them if necessary!</p>
            {renderContent()}
        </div>
    );
}
  
export default UserCards;