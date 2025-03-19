import React, { useEffect, useContext } from 'react';
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
    const {user} = useContext(UserContext);
    const restrictedRoutes = ['/newcard', '/usercards']
    //redirect to login if trying to access restricted route
    useEffect(() => {
        if(user === null){
            if(restrictedRoutes.includes(location.pathname)) {
                navigate('/login', { replace: true });
            }
        }
    }, [location, navigate, restrictedRoutes, user]);

    return null;
}

function App() {
    return (
        <>
            <Navbar/>
            <RedirectComponent/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/login" element={<LogIn/>} />
                <Route path="/newcard" element={<NewCard/>} />
                <Route path="/usercards" element={<UserCards/>} />
                <Route path="/library" element={<CardLibrary/>} />
                <Route path="*" element={<ErrorPage/>} />
            </Routes>
        </>
    );
}

export default App;
