import {useEffect, useReducer, useContext} from 'react'
import UserContext from './context/user.js'

const initialState = { owned: false }

function reducer(state, action){
    switch (action.type) {
      case 'SET_OWNED':
        return { ...state, owned: action.payload };
      default:
        return state;
    }
}

function LibCard({cardData}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {user} = useContext(UserContext);
    useEffect(()=>{
        if(user){
            const isOwned = user.cards.some((userCard) => userCard.id === card.id)
            dispatch({ type: 'SET_OWNED', payload: isOwned })
        }
    }, [user, card])

    function handleAddCard() {
        fetch('/users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
        },
            body: JSON.stringify({ card_id: card.id })
        })
        .then((r) => r.json())
        .then(() =>{
            user.cards.push(cardData)
            dispatch({ type: 'SET_OWNED', payload: true })
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
            (state.owned ? (<p>✓</p>) : 
            (<button onClick={handleAddCard}>Add to Collection</button>)) 
            : null}
        </div>
    )
}

export default LibCard