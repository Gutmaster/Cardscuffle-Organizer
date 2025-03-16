import React, {useState, useEffect} from 'react'
import Card from "./Card.js"

function UserArtist({artist, setUser}) {
    const [cards, setCards] = useState([])

    useEffect(() => {
        fetch(`/artists/${artist.id}/usercards`)
        .then((r) => r.json())
        .then(json => setCards(json));
    }, [artist.id]);

    function handleDelete(id) {
        fetch('users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
        },
            body: JSON.stringify({ card_id: id }),
        })
        .then((r) => r.json())
        .then((json) => setUser(json))
        .catch((error) => {
            console.error("Error:", error);
        });
    }
    
    return (
        <div>
            {cards.map((card) => (
                <Card key={card.id} cardData={card} handleDelete={handleDelete}/>
            ))}
        </div>
    );
}

export default UserArtist;