import { Link } from "react-router-dom";

function Navbar({user}) {
  return (
    <header>
    <h1>{user? `Cardscuffle Organizer, welcome ${user.username}.`
    : 'Welcome, please sign in'}</h1>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/signup">Sign Up </Link>
      </nav>
    </header>
  );
}

export default Navbar;