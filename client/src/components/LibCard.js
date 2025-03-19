import {useContext} from 'react'
import UserContext from './context/user.js'


function LibCard({card}) {
    const {user, setUser} = useContext(UserContext);

    function handleAddCard() {
        fetch('/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
        },
            body: JSON.stringify({ card_id: card.id })
        })
        .then((r) => r.json())
        .then((json) =>{
            setUser(json.user)
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