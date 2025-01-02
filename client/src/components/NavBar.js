import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
    <h1>Animal Paparazzi</h1>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/animals">Animals </Link>
        <Link to="/locations">Locations </Link>
        <Link to="/photographs">Photographs </Link>
        <Link to="/newphoto">Add New Photo </Link>
      </nav>
    </header>
  );
}

export default Navbar;