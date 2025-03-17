import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    console.log(user)
    if(user)
        console.log(user.artists)

    useEffect(() => {
        fetch("/check_session")
        .then((response) => {
            if(response.status === 201)
                return response.json();
            // else if(response.status === 401)
            //     navigate("/login");
        })
        .then(json => setUser(json))
        .catch(error =>setError(error));
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser, error }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;