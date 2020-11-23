/** Firestore API */

import { firestore } from '../firebase';

// GIVEN: A collection name from Firestore API
// RETURNS: A promise The collection from where this was given.
// Retrieve a collection from the database
async function queryDB(collection) {
    const collectionRef = firestore.collection(collection);
    const query = await collectionRef.get();

    // Debugging purposes
    // query.forEach( function(doc) {
    //     console.log(doc.id, " => ", doc.data());
    // });
    return query;
}

export { queryDB };