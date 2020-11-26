/** Asks user for options for the single player game using Material UI modals :) */

// State: if modal is open/closed (default open), difficulty the user selects, challenge selected
// Functionality: Primary responsibility is to set options for the singleplayer game.

import React, { useState, useEffect } from 'react'

import {EASY_DIFFICULTY, MEDIUM_DIFFICULTY, HARD_DIFFICULTY} from './Game/SPSettings.js';
import SPGame from './Game/SPGame';

/** Firestore */
import { queryCollectionDB } from '../../firebase/firestore/firestore.js';

/** Styling */
import './SinglePlayer.css'
import { Modal, FormControl, Select, MenuItem, InputLabel, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function SinglePlayer() {
  // Default state of modal will be OPEN!
  const [open, setOpen] = useState(true);

  // Difficulty of game.
  const [difficulty, setDifficulty] = useState(EASY_DIFFICULTY);

  // List of challenges retrieved from database.
  const [challengeObjects, updateChallengeArray] = useState([]);
  
  // Selected challenge
  const [challengeSelected, challengeToSelect] = useState({id: "RANDOM", name: "Random Words"});

  // Get the challenges from Firestore and adds them to our state.
  useEffect(() => {
    // Add random option challenge. 
    updateChallengeArray(challengeObjects => [...challengeObjects, {id: "RANDOM", name: "Random Words"}]);

    async function getChallenges() {
      const data = await queryCollectionDB("challenges");
      data.forEach( function(challenge) {
        // Push new challenge to array of challengeObjects in state.
        updateChallengeArray(challengeObjects => [...challengeObjects, {id: challenge.id, name: challenge.data().title}]);
      });
    };
    getChallenges();
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
  const modalBody = (
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
        <br></br>
        <Autocomplete
          id="combo-box"
          value={challengeSelected}
          onChange={(event, value) => challengeToSelect(value)}
          options={challengeObjects}
          getOptionLabel={(option) => option.name}
          style={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Choose a challenge" variant="outlined" />}
        />
        <Button onClick={handleClose} className="difficulty-button" variant="outlined">START GAME</Button>
      </FormControl>
    </div>
  );

  return (
    <div>
      <h1>Singleplayer!</h1>
      
      
      <Modal open={open} onClose={handleClose} disableBackdropClick >
        {modalBody}
      </Modal>
      { (!open) ? <SPGame difficulty={difficulty} challenge={challengeSelected}/> : <> </>}


    </div>
  )
}