import React, { useState, useEffect, useContext } from 'react';
import Home from "./Home.js"
import Navbar from "./NavBar.js";
import SignUp from "./SignUp.js"
import LogIn from "./LogIn.js"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import UserCards from "./UserCards.js"
import CardLibrary from "./Library.js"
import NewCard from "./NewCard.js"
import ErrorPage from "./ErrorPage.js";
import UserContext from "./context/user.js";

function RedirectComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const {user, error} = useContext(UserContext);
    const [restrictedRoutes] = useState(['/newcard', '/usercards']);
    
    useEffect(() => {
        if(error)//redirect to error page if check_session errors
            navigate('/error')
        else if(user === null)//redirect to login if trying to access restricted route
            if(restrictedRoutes.includes(location.pathname))
                navigate('/login', { replace: true });
    }, [location, navigate, restrictedRoutes, user]);

    return null;
}

function App() {
    return (
        <>
            <RedirectComponent/>
            <Navbar/>
            <Routes>
                <Route path="*" element={<Home />} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/login" element={<LogIn/>} />
                <Route path="/newcard" element={<NewCard/>} />
                <Route path="/usercards" element={<UserCards/>} />
                <Route path="/library" element={<CardLibrary/>} />
                <Route path="/error" element={<ErrorPage/>} />
            </Routes>
        </>
    );
}

export default App;
