/** Displays the Profile Page  */

// State: user ; represented by object.
// Functionality: Ability to see all things as it pertains to profile
// Also, creates an observer that watches for when the state changes.
import React, { useEffect, useState } from 'react'

// Firebase
import { queryDocumentDB } from '../../firebase/firestore/firestore.js';
import { auth } from '../../firebase/firebase.js';

// Styling
import './Profile.css';

// Material UI
import { CircularProgress } from '@material-ui/core';


export default function Profile(props) {
    const [userProfileInDB, setUserProfileInDB] = useState(null); // (used to get statistics, achievements, and more)
    const [userProfileInGoogle, setUserProfileInGoogle] = useState(null) // (used to get profile image, displayName)

    useEffect(() => {
        // Get user from DB (used to get statistics, achievements, and more)
        async function getUserFromDB() {
            const userID = props.match.params.uid;
            const userData = await queryDocumentDB(userID, "users");
            setUserProfileInDB(userData);
        }
        
        getUserFromDB();

        // Get user from Google (used to get profile image, displayName)
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                setUserProfileInGoogle(user);
                console.log(user);
            } else {
              // No user is signed in.
              window.location = "/";
            }
        });
        
    }, []);

    const formatStatisticLabel = (str) => {
        const result = str.replace( /([A-Z])/g, " $1" );
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    // Display the skills on the profile page.
    const displaySkills = () => {
        if (userProfileInDB.skills.length > 0) {
            const skills = userProfileInDB.skills;
            skills.map((skill, index) => {
                return <li key={index} className="item">Hey</li>
            });

        } else {
            return <div className="list">Oh no! You don't have any skills. Get some here!</div>;
        }
    }

    return (
        <div>
            {userProfileInGoogle && userProfileInDB ? 
            <div>
                <header className="profile-page-header">
                    <a href='/'>
                        <span style={{color: "black"}}className="header-back-arrow">
                            <i className="fas fa-arrow-left"></i>
                        </span>
                    </a>

                </header>

                <section className="google-profile">
                    <figure>
                        <img src={userProfileInGoogle.photoURL} alt="User profile image"></img>
                        <figcaption><a href="https://support.google.com/mail/answer/35529?co=GENIE.Platform%3DDesktop&hl=en&oco=0">Edit Picture</a></figcaption>
                    </figure>
                    <h3><b>Name:</b> {userProfileInGoogle.displayName}</h3>
                    <h3><b>Email:</b> {userProfileInGoogle.email}</h3>
                </section>

                <section className="achievements">
                    <h1>ACHIEVEMENTS</h1>
                    {userProfileInDB.achievements.length === 0 ? <div className="list">No achievements to display. Play Hangman to earn some!</div> 
                    : <></>}
                    {/* Achievements */}
                </section>

                <section className="statistics">
                    {/* Gotten from multiplayer component */}
                    <h1>STATISTICS</h1>
                    <ul className="list">
                        {Object.keys(userProfileInDB.statistics).map((key, index) => {
                            return <li key={index} className="item">{formatStatisticLabel(key) + ":  " + userProfileInDB.statistics[key]}</li>
                        })}
                    </ul>
                    {/* Statistics  */}
                </section>

                <section className="skills">
                    <h1>SKILLS</h1>
                    {displaySkills()}
                    {/* Skills */}
                </section>
            </div>
            :
            <><CircularProgress /></>}
            
        </div>
    )
}
