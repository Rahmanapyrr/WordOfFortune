/** Asks user for options for the single player game using Material UI modals :) */

// State: difficulty the user selects
// Functionality: Primary responsibility is to set options for the singleplayer game.

import React, { useState } from 'react'

import {EASY_DIFFICULTY, MEDIUM_DIFFICULTY, HARD_DIFFICULTY} from './SPSettings.js';
import SPGame from './SPGame';

/** Styling */
import './SinglePlayer.css'
import { Modal, FormControl, Select, MenuItem, InputLabel, Button } from '@material-ui/core';

export default function SinglePlayer() {
  // Default state of modal will be OPEN!
  const [open, setOpen] = useState(true);
  const [difficulty, setDifficulty] = useState(EASY_DIFFICULTY);

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
        <Button onClick={handleClose} className="difficulty-button" variant="outlined">START GAME</Button>
      </FormControl>
    </div>
  );
      
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