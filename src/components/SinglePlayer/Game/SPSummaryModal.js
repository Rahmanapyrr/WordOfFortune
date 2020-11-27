import React from 'react'

import { Modal } from '@material-ui/core';

export default function SPSummaryModal(props) {
    // The body of the Modal
    const modalBody = (
        <div className="modal">
            <h2>Game Summary</h2>
        
        </div>
    );

    const handleClose = () => {
        window.location = '/singleplayer';
    } 

    return (
        <div>
            <Modal open={true} onClose={handleClose} disableBackdropClick >
                {modalBody}
            </Modal>
        </div>
    )
}
