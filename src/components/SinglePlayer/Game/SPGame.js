/** Plays a game of singleplayer Hangman */

// State: 
    // lives: Current lives the player has
    // currentWord: The state of the word the player is guessing.
    // charactersToDisplay: Index of word that should be displayed or hidden.
        // Ex. Word: 'cat' => charactersToDisplay: [0,0,0] === ???  | charactersToDisplay: [0,1,0] === ?a?
    // charactersChosen: Running list of all the characters the user has chosen.
    // hints: Hints for current hangman game
    // theme: Theme for current hangman gane

// Functionality: Primary responsibility is to play a singleplayer game of Hangman
import React, { useState, useEffect } from 'react'

// Firestore
import { queryDocumentDB } from '../../../firebase/firestore/firestore.js';

// Components
import DisplayWord from './DisplayWord.js';
import Characters from './Characters.js';
import SPSummaryModal from './SPSummaryModal.js';

import {EASY_DIFFICULTY, MEDIUM_DIFFICULTY, INVALID_CHARACTERS, HINTS} from './SPSettings.js';

// Styling
import GoBackLogo from './assets/goBackIcon.png';
import BisonLogo from '../../../components/Homepage/assets/bison_logo.png';
import './SPGame.css';
import {Grid, TextField} from '@material-ui/core';


// imported from NPM random words
const randomWords = require('random-words');

export default function SPGame(props) {
    // Grab difficulty and challenge
    const { difficulty, challenge } = props;

    const [currentLives, setCurrentLives] = useState(6); // lives
    const [currentWord, setCurrentWord] = useState([]); // the current word is stored as array
    const [charactersToDisplay, setCharactersToDisplay] = useState([]); // 0/1 array if this char should be displayed or not

    const [charactersChosen, setCharactersChosen] = useState([]); // list of character of chosen

    const [userGuess, setUserGuess] = useState("");
    const [currentHint, setCurrentHint] = useState(""); // current hint that should be displayed
    const [theme, setTheme] = useState("") // theme

    const [summaryModal, openSummaryModal] = useState(false); // summary modal

    // When component loads calls handleUserGuess
    useEffect(() => {
        // Simply sets current word in state
        getChallengeWordBasedOnDifficulty();

    }, []);

    // All this simply does is set the game state based on the word.
    const getChallengeWordBasedOnDifficulty = async() => {
        var words;
        var currentHangmanWord;
        if (challenge.id === "RANDOM") {
            // Vary the length based on difficulty.
            if (difficulty === EASY_DIFFICULTY) {
                words = randomWords({exactly: 5, maxLength: 9});
            } else if (difficulty === MEDIUM_DIFFICULTY) {
                words = randomWords({exactly: 5, maxLength: 16});
            } else {
                words = randomWords({exactly: 5, maxLength: 25});
            }

            // returns random word from a 5 word array
            currentHangmanWord = words[Math.floor(Math.random() * 5)];  // returns a random integer from 0 to 4

            // split is used to convert into array
            setCurrentWord(currentHangmanWord.split(""));
            setTheme("A Random Word");
            setCurrentHint(HINTS[Math.floor(Math.random() * HINTS.length)]);

        } else {
            // Else query firebase database and get the WHOLE document
            const challengeDataFromDB = await queryDocumentDB(challenge.id, "challenges");

            if (difficulty === EASY_DIFFICULTY) {
                words = challengeDataFromDB.easy;
                currentHangmanWord = words[Math.floor(Math.random() * words.length)];
                setCurrentWord(currentHangmanWord.split(""));
            } else if (difficulty === MEDIUM_DIFFICULTY) {
                words = challengeDataFromDB.medium;
                currentHangmanWord = words[Math.floor(Math.random() * words.length)];
                setCurrentWord(currentHangmanWord.split(""));
            } else {
                words = challengeDataFromDB.hard;
                currentHangmanWord = words[Math.floor(Math.random() * words.length)];
                setCurrentWord(currentHangmanWord.split(""));
            }

            setCurrentHint(challengeDataFromDB.hints[Math.floor(Math.random() * challengeDataFromDB.hints.length)]);
            setTheme(challengeDataFromDB.title);
        }

        // Index of word that should be displayed or hidden.
        // Ex. Word: 'cat' => charactersToDisplay: [0,0,0] === ???  | charactersToDisplay: [0,1,0] === ?a?
        const arr = [];
        for (var i = 0; i < currentHangmanWord.length; i++) {
            // we never want to display an invalid character, so push -1. 
            // Hence for a word to be correct we simply check if there are no 0s left.
            if (INVALID_CHARACTERS.includes(currentHangmanWord[i])) arr.push(-1);
            else {
                arr.push(0);
            }
        }
        setCharactersToDisplay(arr);
    }

    // !REALLY IMPORTANT FUNCTION! This controls the entire Hangman Game.
    const handleCharacterClick = (char) => {
        // Add this character that was chosen by user. Ex. '???'. User chose 'a'. This will always get added to chosen_character set.
        setCharactersChosen([...charactersChosen, char]);

        // Check if this char is included in the word. (Handle upper/lowercase)
        if (currentWord.includes(char.toLowerCase()) || currentWord.includes(char.toUpperCase())) {
            console.log("YES! This character is right.");

            // Update state of characters to display
            var modifyCharacterToDisplay = charactersToDisplay;
            for (var i = 0; i < currentWord.length; i++) {
                // (Handle upper/lowercase)
                if (currentWord[i] === char.toLowerCase() || currentWord[i] === char.toUpperCase()) {
                    modifyCharacterToDisplay[i] = 1;
                }
            }
            // check if word spelled
            var wordSpelled = true;
            for (var i = 0; i < modifyCharacterToDisplay.length; i++) {
                if (modifyCharacterToDisplay[i] === 0) {
                    wordSpelled = false;
                }
            }
            if (wordSpelled) openSummaryModal(true);

            setCharactersToDisplay(modifyCharacterToDisplay);
            

        } else {
            // This char is NOT included in the word.
            console.log("I'm sorry, this character is wrong"); 

            // Decrease Lives.

            // Check if out of lives
            if (currentLives - 1 <= 0) {
                console.log("Out of lives!");
                setCurrentLives(0);
                // open summary modal
                openSummaryModal(true);

            } else setCurrentLives(currentLives - 1);
            
        }
     
    }

    // Handles if a user guessed.
    const handleUserGuess = (event) => {
        // Enter was pressed
        if (event.key === "Enter") {
            if (currentWord.join('').toUpperCase() === userGuess.toUpperCase()) {
                // Guess was correct
                console.log("GUESS WAS CORRECT!");
                openSummaryModal(true);
            } else {
                // Guess was incorrect.
                if (currentLives - 2 <= 0) {
                    console.log("Out of lives!");
                    setCurrentLives(0);
                    // open summary modal
                    openSummaryModal(true);
                } else setCurrentLives(currentLives - 2);

                console.log("Wrong guess..");
            }
        }       
    }

    

    
    console.log(currentWord);
    console.log(charactersToDisplay);
    

    return (
        
        <div>
            <header>
                <a href='/singleplayer'>
                    <span className="back-arrow">
                        <i class="fas fa-arrow-left"></i>
                    </span>
                </a>
                <img src={BisonLogo} alt="Bison Logo"></img>

            </header>
            <div>
                <h1>{"Theme: " + theme}</h1>
            </div>


            <section>
                {/* Hangman */}
                <Grid container spacing={2}>
                    <Grid className="lives" item xs>
                        <h3>{`Lives: `} {[...Array(currentLives)].map((e, i) => <i key={i} class="fas fa-heart heart"></i>)}</h3>
                    </Grid>
                    <Grid item xs>
                        <Characters className="characters" charactersChosen={charactersChosen} handleCharacterClick={handleCharacterClick}/>
                    </Grid>
                    
                </Grid>

            </section>

            <section>  
                <Grid container>
                    <Grid item xs>
                        <DisplayWord currentWord={currentWord} charactersToDisplay={charactersToDisplay}/>
                        <TextField value={userGuess} onChange={(e) => setUserGuess(e.target.value)} onKeyUp={(e) => handleUserGuess(e)} color="primary" label="Guess word!" variant="filled"/>
                    </Grid>
                    <Grid item xs>
                        <h3>{"Hint: " + currentHint}</h3>
                    </Grid>
                </Grid>
            </section>

            {summaryModal ? <SPSummaryModal/> : <> </>}     
        
        </div>
    )
}