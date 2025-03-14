import LibCard from "./LibCard.js"

function Set({set, setUser}) {
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
            {set.cards.map((card) => (
                <LibCard key={card.id} cardData={card} handleDelete={handleDelete}/>
            ))}
        </div>
    );
    }

export default Set;