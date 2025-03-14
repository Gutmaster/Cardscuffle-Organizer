import { Link } from "react-router-dom";

function Home() {
    return (
      <div className='home'>
        <div className='homeText'>
          <h1 className='title'>Welcome to the Cardscuffle collection digitizer!</h1>
          <p>
            Here you can add and track which Cardscuffle <Link to="/usercards">cards you own</Link>, or update the database with your own!
            You can also view and add to your collection any card that currently exists in our <Link to="/library">library</Link>.
            Don't forget to <Link to="/login">log in</Link> or <Link to="/signup">sign up!</Link>.
          </p>
        </div>
      </div>
    );
}

export default Home;