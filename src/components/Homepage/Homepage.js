/** Displays the Homepage of Hangman  */

// State: user ; represented by object.
// Functionality: Ability to log the user in and log the user out.
// Also, creates an observer that watches for when the state changes.

import React, { useState } from 'react';
import { Link } from 'react-router-dom'

/** Functions */
import logIn from '../../firebase/auth/Login.js';
import logOut from '../../firebase/auth/Logout.js';
import { auth } from '../../firebase/firebase'
import { addUserToDB } from '../../firebase/firestore/firestore.js';

/** Styling */
import './Homepage.css';

// Images
import BisonLogo from './assets/bison_logo.png';
import GitHubLogo from './assets/github_logo.png';

// React-Spring for animation
import {useSpring, animated} from 'react-spring'

// Material UI
import {Button} from '@material-ui/core';

export default function Homepage() {
    // State
    const [user, setUser] = useState(null); // user is represented as an object in firebase

    // Animations
    const fadeIn = useSpring({opacity: 1, from: {opacity: 0}, Duration: 1000});
    const fromAbove = useSpring({marginTop: 0, from: {marginTop: -1000}, Duration: 700});

    // Log user in
    const logInUser = async() => {
        await logIn();
    }

    // Log user out
    const logOutUser = async() => {
        logOut();
    }

    // Sets an observer on the Auth object to watch and update state 
    // whenever the user is signed in or signed out.
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User signed in.
            addUserToDB(user);
            setUser(user);
        } else {
            // No user is signed in.
            setUser(null);
        }
    });

    return (
        <div>
            <animated.div style={fadeIn}>
                <header>
                    {(user) ? 
                        <div>
<<<<<<< HEAD
                            <img src={user.photoURL} alt="description in case"></img>
                            <h2>{user.displayName}</h2>
=======
                            <img src={user.photoURL} alt="User profile"></img>
                            <a className="profile" href={`/profile/${user.uid}`}><h4>{user.displayName}</h4></a>
>>>>>>> 37f4f4d7e29beb3de8b6c45342458d7ef1805f02
                            <Button onClick={logOutUser} style={{color: "#5647FD"}} variant="outlined" color="primary">
                                    Log Out
                            </Button>
                        </div>
                        :
                        <div>
                            <Button onClick={logInUser} style={{color: "#5647FD"}} variant="outlined" color="primary">
                                Log In
                            </Button>
                        </div>
                    }
                </header>
            </animated.div>
            
            <animated.div style={fromAbove}>
                <main>
                    <img alt="Howard University Logo" src={BisonLogo} />
                    <h1>Bison Hangman</h1>
                </main>
            </animated.div>

            <nav>
                <Button component={Link} to={"/singleplayer"} className="singleplayer"  variant="contained" color="primary">Singleplayer</Button>
                <Button className="multiplayer" variant="contained" color="primary">Multiplayer</Button>
                <Button className="options"  variant="contained" color="primary">Options</Button>

            </nav>

            <animated.div style={fadeIn}>
                <footer>
                    <a href="https://github.com/Rahmanapyrr/WordOfFortune"><img src={GitHubLogo} alt="GitHub Logo"></img></a>

                </footer>
            </animated.div>
        </div>
    )
}

