/** Logs the user in */

import { firebase, auth } from '../firebase.js';

// Log the user in 
async function logIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        return user;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

export default logIn;