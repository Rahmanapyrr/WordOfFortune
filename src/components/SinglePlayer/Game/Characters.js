/** Displays the state of the characters the user has left.
 * In other words, this component is ONLY in charge of the : 'ABCD....YZ&' seen on the screen.
 */

// State: None
// Functionality: Display the state of the CHARACTERS that the user has left to use.

import React from 'react'

import { ALLOWED_CHARACTERS } from './SPSettings';

// GIVEN: charactersChosen: List of characters that has been chosen AND handleCharacterClick: callback function to handleCharacterClick
// RETURNS: <div>{available_character}{available_character2}...{available_character27}</div>
export default function Characters({ charactersChosen, handleCharacterClick }) {

    // Update the state of ALL the possible characters the user can choose.
    const getCharacterState = () => {
        return ALLOWED_CHARACTERS.map( (char, index) => {

            // Disabled version. The user has already chosen this character.
            if (charactersChosen.includes(char)) {
                return (

                    <div style={disabledCharacter} key={index}>
                        {char}
                    </div>
                ) 
            } else {

                // Active version. The user can choose this character.
                return (
                    <div onClick={(event) => handleCharacterClick(event.target.innerHTML)} style={activeCharacter} key={index}>
                        {char}
                    </div>
                ) 
            }
        })
    }


    return (
        <div>
            {getCharacterState()}
            
        </div>
    )
}

const activeCharacter = {
    border: "2px solid blue",
    display: "inline-flex",
    backgroundColor: "##f7f5f5",
    borderRadius: "4px",
    padding: "10px",
    margin: "20px",
    fontWeight: "bold",
    cursor: "pointer",
};

const disabledCharacter = {
    display: "inline-flex",
    backgroundColor: "#706f6f",
    borderRadius: "4px",
    padding: "10px",
    margin: "20px",
};