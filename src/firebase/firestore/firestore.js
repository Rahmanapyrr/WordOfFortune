/** Firestore API */

import { firestore } from '../firebase';

// Retrieve an entire collection from Firebase Firestore 
// GIVEN: A collection name from Firestore API
// RETURNS: An array of documents by looping through for each.
async function queryCollectionDB(collectionName) {
    const collectionRef = firestore.collection(collectionName);
    const query = await collectionRef.get();

    // Debugging purposes
    // query.forEach( function(doc) {
    //     console.log(doc.id, " => ", doc.data());
    // });
    return query;
}

// Retrieve a document from a collection on Firebase Firestore
// GIVEN: A document ID from Firestore API and a collection name from Firestore API
// RETURNS: The specified document object
async function queryDocumentDB(documentID, collectionName) {
    const documentRef = firestore.collection(collectionName).doc(documentID);

    try {
        const document = await documentRef.get();

        if (document.exists) {
            return document.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document found!");
        }
    } catch(e) {
        console.log(e);
    }
}

// Adds a user to Firebase Firestore
// GIVEN: A data and a collection name from Firestore API
// RETURNS: Success or Failure.
async function addUserToDB(userData) {
    const userDocumentRef = firestore.collection("users").doc(userData.uid);

    try {
        const setWithMerge = userDocumentRef.set({
            rank: 0,
            statistics: {
                roundsWon: 0,
                roundsLost: 0,
                charactersGuessed: 0,
                charactersWrong: 0,
            },
            achievements: [],
            skills: [], // power ups or skills
            lastLoggedIn: new Date(),
        }, { merge: true });
        
        return true;

    } catch(e) {
        console.log(e);
        return false;
    }
}

export { queryCollectionDB, queryDocumentDB, addUserToDB };