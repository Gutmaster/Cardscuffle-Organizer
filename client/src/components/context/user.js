import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/check_session")
        .then((response) => {
            if (response.status === 201)
                return response.json();
            else if (response.status === 500)
                throw new Error("Server Error: 500");
            else
                return null;
        })
        .then(json => {
            setUser(json);
            setLoading(false);
        })
        .catch(error => {
            console.log(error)
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;