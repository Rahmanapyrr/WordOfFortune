/** Displays the Homepage of Hangman  */

// State: user ; represented by object.
// Functionality: Ability to log the user in and log the user out.

import React, { useState } from 'react';

import './Homepage.css';
import BisonLogo from './assets/bison_logo.png';
import GitHubLogo from './assets/github_logo.png';

// React-Spring for animation
import {useSpring, animated} from 'react-spring'

// Material UI
import {Button} from '@material-ui/core';

export default function Homepage() {
    const [user, setUser] = useState(null); // user is represented as an object in firebase

    const fadeIn = useSpring({opacity: 1, from: {opacity: 0}, Duration:300});
    const fromAbove = useSpring({marginTop: 0, from: {marginTop: -1000}, Duration: 2000})
    return (
        <div>
            <animated.div style={fadeIn}>
                <header>
                    {(user) ? <h2>Hello user</h2>
                        :
                        <div>
                            <Button style={{color: "#5647FD"}} variant="outlined" color="primary">
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
                <Button className="singleplayer"  variant="contained" color="primary">Singleplayer</Button>
                <Button className="multiplayer" variant="contained" color="primary">Multiplayer</Button>
                <Button className="options"  variant="contained" color="primary">Options</Button>

            </nav>

            <footer>
                <a href="https://github.com/Rahmanapyrr/WordOfFortune"><img src={GitHubLogo}></img></a>

            </footer>



            {/* <Hangman/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p style={props}> Welcome to Word of Fortune! Let's Play!
        <animated.div style={props}>I will fade in</animated.div>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
        </div>
    )
}

