import { Link } from "react-router-dom";

function Home() {
    return (
      <div className='home'>
        <div className='homeText'>
          <h1 className='title'>Welcome to the Cardscuffle collection digitizer!</h1>
          <p>
            Here you can add and track which Cardscuffle cards you have and view your collection sorted by Artist or card set.
            <Link to="/animals">animals</Link>
          </p>
        </div>
      </div>
    );
}

export default Home;