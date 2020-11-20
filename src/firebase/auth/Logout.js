/** Logs the user out. */

import { auth } from '../firebase.js';

// Log the user out
function logOut() {
    try {
        auth.signOut();
    } catch (e) {
        console.log(e);
    }
}

export default logOut;