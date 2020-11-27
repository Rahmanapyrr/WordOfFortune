/** Displays the state of the current word
 * In other words, this component is ONLY in charge of the : '???' and 'a?a' seen on the screen.
 */

// State: None
// Functionality: Display the state of the word that is currently being guessed.

import React from 'react'

// SinglePlayer Game Settings
import { INVALID_AMPERSAND, INVALID_DASH, INVALID_SPACE } from './SPSettings';

// GIVEN: charactersToDisplay: (array) which character index should be shown/hidden AND currentWord: (string) the correct word
// RETURN: <div>{state of word that user is guessing}</div>
export default function DisplayWord({ charactersToDisplay, currentWord }) {
    // Loop through charactersToDisplay and if 1: display | 0: do not display 
    // For instance: 
    // charactersToDisplay: [1, 0, 1] and currentWord: ['c', 'a', 't'] ---> c?t will be displayed.

    // NOTE: Invalid characters are special cases. We have to separate the words in some way/form.
    const display = () => {
        var updatedWordToDisplay = "";

        charactersToDisplay.map( (display, index) => {
            // Is this character invalid?
            if (currentWord[index] === INVALID_SPACE) updatedWordToDisplay += " ";
            else if (currentWord[index] === INVALID_DASH) updatedWordToDisplay += "-";
            else if (currentWord[index] === INVALID_AMPERSAND) updatedWordToDisplay += "&";

            // If character is valid...

            // Has user guessed this character yet?
            else if (display) updatedWordToDisplay += currentWord[index].toUpperCase();

            // I guess the user hasn't, so display a '?'.
            else updatedWordToDisplay += "?";
        })

        // Return to display to screen.
        return updatedWordToDisplay;
    }

    return (
        <div style={style}>
            {display()}
        </div>
    )
}

const style = {
    fontSize: "5em",
};
