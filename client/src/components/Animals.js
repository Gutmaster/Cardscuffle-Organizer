import Animal from "./Animal.js"

function Animals({animals}) {
  return (
    <div className='animals'>
      <section className="container">
        {animals.map((animal) => (
          <div key = {animal.id}>
              <Animal animal = {animal}/>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Animals;