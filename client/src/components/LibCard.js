import {useEffect, useReducer} from 'react'

 const initialState = { owned: false }

function reducer(state, action){
    switch (action.type) {
      case 'SET_OWNED':
        return { ...state, owned: action.payload };
      default:
        return state;
    }
}

function LibCard({card, user}) {
  const [state, dispatch] = useReducer(reducer, initialState);
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
      user.cards.push(card)
      dispatch({ type: 'SET_OWNED', payload: true })
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  return (
      <div className="card">
        <h1 className='cardTitle'>{card.name}</h1>
        <span className='container'>
          <img src={card.art} alt={'art unavailable'}/>
        </span>

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