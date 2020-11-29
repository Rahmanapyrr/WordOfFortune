/** Functions for each skill */

import { ALLOWED_CHARACTERS } from './SPSettings';

// Removes a character from the available words that is incorrect.
function SKILL_removeCharacter(charactersChosen, currentWord) {
    const charactersNotChosen = ALLOWED_CHARACTERS.filter(char => !charactersChosen.includes(char.toUpperCase()) && !charactersChosen.includes(char.toLowerCase()));
    const charactersNotInWord = charactersNotChosen.filter(char => !currentWord.includes(char.toUpperCase()) && !currentWord.includes(char.toLowerCase()));
    const char = charactersNotInWord[Math.floor(Math.random() * charactersNotInWord.length)];

    return [...charactersChosen, char];
}

export { SKILL_removeCharacter }