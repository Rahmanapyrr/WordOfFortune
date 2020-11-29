import React from 'react'

// Styling
import { Modal, Button } from '@material-ui/core';
import Confetti from 'react-confetti'


import './SPSummaryModal.css';

export default function SPSummaryModal(props) {
    // The body of the Modal
    const modalBody = (
        <div className="summary-modal">
            <h1>Game Summary</h1>
            <h3>The word was: <span style={{color: "green"}}>{props.correctWord}</span></h3>
            {
                props.roundWon ? <><h3>Congratulations, you got the word!</h3></> : <h3>Oops. You didn't get this one. Try again!</h3>
            }
            {
                props.roundWon ? <><h3>You had <span style={{color: "green"}}>{props.currentLives}</span> lives left!</h3></> : <></>
            }
            <Button variant="contained" color="primary" href="/singleplayer">All done!</Button>
        </div>
    );

    const handleClose = () => {
        window.location = '/singleplayer';
    } 

    return (
        <div>
            {(props.roundWon) ? <Confetti width={2000} height={1000} /> : <></> }
            <Modal open={true} onClose={handleClose} disableBackdropClick >
                {modalBody}
            </Modal>
        </div>
    )
}
