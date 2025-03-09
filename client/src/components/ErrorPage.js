import React from 'react';

function ErrorPage({message}) {
    return (
        <div className='container'>
            <h1>{message}</h1>
            <a href="/">Go back to Home</a>
        </div>
    );
};

export default ErrorPage;