import { Link } from "react-router-dom";

function Navbar({user}) {
  return (
    <header>
    <h1>{user? `Animal Paparazzi, welcome ${user.username}.`
    : 'Welcome, please sign in'}</h1>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/signup">Sign Up </Link>
        <Link to="/patiencegame">Patience Game </Link>
        <Link to="/animals">Animals </Link>
        <Link to="/locations">Locations </Link>
        <Link to="/photographs">Photographs </Link>
        <Link to="/newphoto">Add New Photo </Link>
      </nav>
    </header>
  );
}

export default Navbar;