import { Link } from "react-router-dom";

function Navbar({user}) {
  return (
    <header>
    <h1>{user? `Cardscuffle Organizer, welcome ${user.username}.`
    : 'Welcome, please sign in'}</h1>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/signup">Sign Up </Link>
        <Link to="/login">Log In </Link>
        <Link to="/cards">My Cards </Link>
        <Link to="/newcard">New Card</Link>
      </nav>
      {user && <button onClick={() => {localStorage.removeItem('user'); window.location.reload()}}>Log Out</button>}
    </header>
  );
}

export default Navbar;