import { Link } from "react-router-dom";

function Navbar({user, setUser}) {
  function HandleLogOut() {
    fetch("logout")
      .then(response => {
        if (response.ok) {
          setUser(null);
          window.location.reload();
        } else {
          // Handle server errors
          console.error('Logout failed', response.statusText);
        }
      })
      .catch(error => console.error('Network error:', error));
  }

  return (
    <header>
    <h1>{user? `Cardscuffle Organizer, welcome ${user.username}.`
    : 'Welcome, please sign in'}</h1>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/signup">Sign Up </Link>
        <Link to="/login">Log In </Link>
        <Link to="/usercards">My Cards </Link>
        <Link to="/library">Card Library</Link>
        <Link to="/newcard">New Card</Link>
      </nav>
      {user && <button className='logoutButton' onClick={HandleLogOut}>Log Out</button>}
    </header>
  );
}

export default Navbar;