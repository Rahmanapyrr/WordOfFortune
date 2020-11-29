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

// Single player settings
import {EASY_DIFFICULTY, MEDIUM_DIFFICULTY, INVALID_CHARACTERS, HINTS} from './SPSettings.js';
import { SKILL_removeCharacter } from './Skills';

/* Styling */
import BisonLogo from '../../../components/Homepage/assets/bison_logo.png';
import './SPGame.css';

// Material UI
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

    const [userGuess, setUserGuess] = useState(""); // know the word? GUESS IT!
    const [currentHint, setCurrentHint] = useState(""); // current hint that should be displayed
    const [theme, setTheme] = useState("") // theme
    const [roundWon, setRoundWon] = useState(false); // did the user win or lose the round? USED IN SUMMARY MODEL

    const [summaryModal, openSummaryModal] = useState(false); // summary modal

    // e.g. for: 'A' was included!  
    const [char, setChar] = useState(null); 
    const [wasIncluded, setIncludedState] = useState(false); // was character included or excluded?

    // skills
    const [SKILL_removeCharacterActive, SKILL_setRemoveCharacterState] = useState(true) //

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

            // Update state of characters to display
            var modifyCharacterToDisplay = charactersToDisplay;
            for (var i = 0; i < currentWord.length; i++) {
                // (Handle upper/lowercase)
                if (currentWord[i] === char.toLowerCase() || currentWord[i] === char.toUpperCase()) {
                    modifyCharacterToDisplay[i] = 1;
                }
            }
            // Set Character Included/Excluded State
            setChar(char);
            setIncludedState(true);

            // check if word spelled
            var wordSpelled = true;
            for (i = 0; i < modifyCharacterToDisplay.length; i++) {
                if (modifyCharacterToDisplay[i] === 0) {
                    wordSpelled = false;
                }
            }
            if (wordSpelled) {
                setRoundWon(true); // user won the round
                showAllCharacters(); // tell displayCharacters to show all characters
                openSummaryModal(true);
            }

            setCharactersToDisplay(modifyCharacterToDisplay);
            

        } else {
            // This char is NOT included in the word.
            // Set Character Included/Excluded State
            setChar(char);
            setIncludedState(false);

            // Decrease Lives.

            // Check if out of lives
            if (currentLives - 1 <= 0) {
                showAllCharacters();
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

                showAllCharacters();
                setRoundWon(true);
                openSummaryModal(true);
            } else {
                // Guess was incorrect.
                if (currentLives - 2 <= 0) {
                    showAllCharacters();
                    setCurrentLives(0);
                    setRoundWon(false);
                    // open summary modal
                    openSummaryModal(true);
                } else setCurrentLives(currentLives - 2);

                console.log("Wrong guess..");
            }
        }       
    }

    // When the game is over simply show all characters.
    const showAllCharacters = () => {
        // Show all characters.
        var modifyCharacterToDisplay = charactersToDisplay;
        for (var i = 0; i < modifyCharacterToDisplay.length; i++) modifyCharacterToDisplay[i] = 1;
        
        setCharactersToDisplay(modifyCharacterToDisplay);
    }

    // Handle if a user clicked a skill.
    const handleRemoveCharacterSkill = (event) => {
        event.target.style.opacity = 0.2;
        event.target.style.cursor = "default";
        if (SKILL_removeCharacterActive) {
            setCharactersChosen(SKILL_removeCharacter(charactersChosen, currentWord));
            SKILL_setRemoveCharacterState(false);
        }
    }

    console.log(currentWord);

    return (
        <div>
        
            <header className="game">
                <a href='/singleplayer'>
                    <span className="back-arrow">
                        <i className="fas fa-arrow-left"></i>
                    </span>
                </a>
                <img src={BisonLogo} alt="Bison Logo"></img>

            </header>
            <div>
                <h1 className="sp-game-header">{"Theme: " + theme + " | Difficulty: " + difficulty}</h1>
            </div>
       


            <section>
                {/* Hangman */}
                <Grid container spacing={2}>
                    <Grid className="lives" item xs>
                        <h3>{`Lives: `} {[...Array(currentLives)].map((e, i) => <i key={i} className="fas fa-heart heart"></i>)}</h3>
                    </Grid>
                    <Grid item xs>
                        <Characters className="characters" charactersChosen={charactersChosen} handleCharacterClick={handleCharacterClick}/>
                        
                        {(char) ? (wasIncluded) ? <div><h2 className="char-included">{char} was correct!</h2></div> : 
                        <div><h2 className="char-excluded">{char} was incorrect!</h2></div> : <></>}
                        
                    </Grid>
                    
                </Grid>

            </section>

            <section>  
                <Grid container>
                    <Grid item xs>
                        <DisplayWord currentWord={currentWord} charactersToDisplay={charactersToDisplay}/>
                        <TextField value={userGuess} onChange={(e) => setUserGuess(e.target.value)} onKeyUp={(e) => handleUserGuess(e)} color="primary" label="Guess word!" variant="filled" />
                    </Grid>
                    <Grid item xs>
                        <h3 className="hint">{"Hint: " + currentHint}</h3>
                    </Grid>
                </Grid>
            </section>

            <section className="sp-game-skills">
                <span onClick={handleRemoveCharacterSkill} style={{fontSize: "30px"}}><i className="fas fa-eraser"></i></span>
            </section>

            {summaryModal ? <SPSummaryModal correctWord={currentWord} roundWon={roundWon} currentLives={currentLives}/> : <> </>}     
        
        </div>
    )
}