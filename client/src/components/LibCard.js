import {useContext} from 'react'
import UserContext from './context/user.js'


function LibCard({card}) {
    const {user, setUser} = useContext(UserContext);

    function handleAddCard() {
        fetch('/usercards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
        },
            body: JSON.stringify({ card_id: card.id })
        })
        .then((r) => {
            return r.json()
        })
        .then((json) =>{
            setUser(json)
            //find artist and set in user list
            const artist = user.artists.find(a => a.id === card.artist.id)
            const set = user.sets.find(s => s.id === card.set.id)
            // if artist not in user list, replace artist's cards with this card only and add artist to current user
            if(!artist){
                card.artist.cards = [card]
                user.artists.push(card.artist)
            }
            else
                artist.cards.push(card)
            if(!set){
                card.set.cards = [card]
                user.sets.push(card.set)
            }
            else
                set.cards.push(card)
            user.cards.push(card)
        })
            .catch((error) => {
            console.error("Error:", error);
        });
    }

    return (
        <div className="card">
            <h1 className='cardTitle'>{card.name}</h1>
            <img src={card.art} alt={'art unavailable'}/>
            <p className='artistName'>{card.artist.name}</p>                            
            <p className='setName'>{card.set.name}</p>
            {user ? 
                (user.cards.find(uCard => uCard.id === card.id) ? (<p style={{color:"green"}}>Owned ✓</p>) : 
                (<button onClick={handleAddCard}>Add to Collection</button>)) 
            : null}
        </div>
    )
}

export default LibCard