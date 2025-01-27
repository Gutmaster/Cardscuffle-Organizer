import React, {useState, useEffect} from 'react';

function PatienceGame({user, scores, fetchScores}){
    const [timePassed, setTimePassed] = useState(0)

    console.log("CURREnTUSER: ", user)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimePassed(prevTime => prevTime + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    async function gameOver() {
        try {
            const response = await fetch('/_scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user.username,
                    score: timePassed
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setTimePassed(0);
            fetchScores();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    return (
        <div>
            <h1>Patience Game</h1>

            {user?
                <div>
                    <p>
                        The goal of this game is to wait. You have waited {timePassed} seconds.
                    </p>
                    <button onClick={gameOver}>End Game</button> 
                </div>
            :
                <p>Please sign up to play game.</p>}

            <h2>High Scores</h2>
                {scores
                    .sort((a, b) => b.score - a.score)
                    .map((score, index) => (
                    <div key={index}>
                        <p>{index + 1}. {score.user.username}: {score.score} seconds</p>
                    </div>
                ))}
        </div>
    );
}

export default PatienceGame;