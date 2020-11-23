/** Asks user for options for the single player game using Material UI modals :) */

// State: difficulty the user selects
// Functionality: Primary responsibility is to set options for the singleplayer game.

import React, { useState, useEffect } from 'react'

import {EASY_DIFFICULTY, MEDIUM_DIFFICULTY, HARD_DIFFICULTY} from './SPSettings.js';
import SPGame from './SPGame';

/** Firestore */
import { queryDB } from '../../firebase/firestore/firestore.js';

/** Styling */
import './SinglePlayer.css'
import { Modal, FormControl, Select, MenuItem, InputLabel, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

// imported from NPM random words
var randomWords = require('random-words');
// console.log(randomWords({exactly: 5, maxLength: 15}));

export default function SinglePlayer() {
  // Default state of modal will be OPEN!
  const [open, setOpen] = useState(true);
  const [difficulty, setDifficulty] = useState(EASY_DIFFICULTY);
  const [challengeObjects, updateChallengeArray] = useState([]);


  useEffect(() => {
    // Get the challenges from Firestore and adds them to our state.
    async function getChallenges() {
      const data = await queryDB("challenges");
      data.forEach( function(challenge) {
        // Push new challenge to array of challengeObjects in state.
        updateChallengeArray(challengeObjects => [...challengeObjects, {id: challenge.id, nameOfChallenge: challenge.data().title}]);
      });
    };
    getChallenges();
    // Add random option. Simply queries a dictionary API for a random word.
    updateChallengeArray(challengeObjects => [...challengeObjects, {id: "random", nameOfChallenge: "Random"}]);
  }, []);

  // Handle the close of the model
  const handleClose = () => {
    setOpen(false);
  };

  // Sets the difficulty when the user changes the value
  const handleDifficulty = (e) => {
    setDifficulty(e.target.value);
  }

  // The body of the Modal
  const body = (
    <div className="modal">
      <h2>Ready to get started?</h2>
      <FormControl className="form">
        <InputLabel id="difficulty">Difficulty</InputLabel>
        <Select
          labelId="difficulty"
          id="difficulty-label"
          value={difficulty}
          onChange={handleDifficulty}
        >
          <MenuItem value={EASY_DIFFICULTY}>Easy</MenuItem>
          <MenuItem value={MEDIUM_DIFFICULTY}>Medium</MenuItem>
          <MenuItem value={HARD_DIFFICULTY}>Hard</MenuItem>
        </Select>
        <Autocomplete
          id="combo-box"
          onChange={(event, value) => console.log(value)}
          options={challengeObjects}
          getOptionLabel={(option) => option.nameOfChallenge}
          style={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Choose a challenge" variant="outlined" />}
        />
        <Button onClick={handleClose} className="difficulty-button" variant="outlined">START GAME</Button>
      </FormControl>
    </div>
  );

  
  console.log(challengeObjects);
  return (
    <div>
      <h1>Singleplayer!</h1>
      
      
      <Modal open={open} onClose={handleClose} disableBackdropClick >
        {body}
      </Modal>
      <SPGame difficulty={difficulty}/>

    </div>
  )
}