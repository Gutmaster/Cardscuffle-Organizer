

//     // const [errorMessage, setErrorMessage] = useState('')
//     // const navigate = useNavigate();
  

  
//     // const handleError = useCallback((error) => {
//     //   setErrorMessage(error.toString());
//     //   if (window.location.pathname !== "/error")
//     //     navigate("/error");
//     // }, [navigate]);
  



import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
//     useEffect(() => {
//         fetch("/check_session")
//         .then((response) => {
//             if(response.status === 201)
//                 return response.json();
//             // else if(response.status === 401)
//             //     navigate("/login");{
//         })
//         .then(json => setUser(json))
//         // .catch(error =>handleError(error));
//     }, []);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;