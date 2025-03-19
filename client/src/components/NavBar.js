import { Link, useNavigate } from "react-router-dom";
import {useContext} from 'react';
import UserContext from "./context/user";

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function HandleLogOut() {
        fetch("logout")
        .then(response => {
            if (response.ok) {
                setUser(null);
                navigate('/login');
            } else {
                // Handle server errors
                console.error('Logout error', response.statusText);
            }
            setUser(null)
        })
        .catch(error => console.error('Network error:', error));
    }

    return (
        <header>
            {user ? (
                <>
                    <h1>{`Cardscuffle Organizer, welcome ${user.username}.`}</h1>
                    <nav>
                        <Link to="/">Home </Link>
                        <Link to="/usercards">My Cards </Link>
                        <Link to="/library">Card Library</Link>
                        <Link to="/newcard">New Card</Link>
                    </nav>
                    <button className='logoutButton' onClick={HandleLogOut}>Log Out</button>
                </>
            ) : (
                <>
                    <h1>Welcome, please sign up or log in.</h1>
                    <nav>
                        <Link to="/">Home </Link>
                        <Link to="/signup">Sign Up </Link>
                        <Link to="/login">Log In </Link>
                        <Link to="/library">Card Library</Link>
                    </nav>
                </>
            )}
        </header>
      );
}

export default Navbar;