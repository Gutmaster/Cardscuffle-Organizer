import Location from "./Location.js"

function Locations({locations}) {
  return (
    <div className='locations'>
      <section className="container">
        {locations.map((location) => (
          <div key = {location.id}>
              <Location location = {location}/>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Locations;