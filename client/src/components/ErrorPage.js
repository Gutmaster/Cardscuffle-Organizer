import React, {useContext} from 'react';
import UserContext from './context/user';

function ErrorPage() {
    const {error} = useContext(UserContext);

    return (
        <div className='container'>
            <h1>{error ? error.message : 'You found the error page, congratulations!'}</h1>
            <a href="/">Go back to Home</a>
        </div>
    );
};

export default ErrorPage;