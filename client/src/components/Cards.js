import Card from "./Card.js"

function Cards({cards}) {
  return (
    <div className='animals'>
      <section className="container">
        {cards.map((card) => (
          <div key = {card.id}>
              <Card card = {card}/>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Cards;