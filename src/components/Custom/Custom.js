import React, { useState, useEffect } from 'react'

// Game
import SPGame from '../SinglePlayer/Game/SPGame';
import {EASY_DIFFICULTY, MEDIUM_DIFFICULTY, HARD_DIFFICULTY} from '../SinglePlayer/Game/SPSettings.js';

// Generating new challenge
import { uuid } from 'uuidv4';

// Firestore
import { firestore, auth } from '../../firebase/firebase.js';
import { queryDocumentDB, queryCollectionDB } from '../../firebase/firestore/firestore.js';

/** Styling */
import './Custom.css';
import BisonLogo from '../Homepage/assets/bison_logo.png';

// Material UI
import { BottomNavigation, BottomNavigationAction, Icon, Button, TextField, Select, MenuItem } from '@material-ui/core'

export default function Custom() {
    const [value, setValue] = useState(0);

    const [userID, setUserID] = useState("");

    // Editing
    const [editing, setEditing] = useState(false);
    const [editChallenge, setEditChallenge] = useState(null); // challenge we are editing

    const [challengeName, setChallengeName] = useState("");
    const [editEasy, setEditEasy] = useState("");
    const [editMedium, setEditMedium] = useState("");
    const [editHard, setEditHard] = useState("");
    const [editHint, setEditHint] = useState("");

    const [userChallenges, setUserChallenges] = useState([]);

    // Add new challenge
    const [addNewChallenge, setAddNewChallenge] = useState(false);

    const [challengeIDToPlay, setChallengeIDToPlay] = useState("");
    const [challengeToPlay, setChallengeToPlay] = useState(null);
    const [play, setPlay] = useState("");
    const [difficulty, setDifficulty] = useState(EASY_DIFFICULTY);

    useEffect(() => {
        const getChallenges = () => {
            // Get user ID
            var id = "";
            auth.onAuthStateChanged(async(user) => {
                if (user) {
                    // User is signed in.

                    // Get all challenges
                    id = user.uid;
                    const userObject = await queryDocumentDB(id, "users");
                    setUserID(id);
                    setUserChallenges(userObject.created_challenges);
                } else {
                window.location = '/';
                }
            });
        }

        getChallenges();
    }, []);

    const handleAddChallenge = (e) => {
        setAddNewChallenge(true);
        setEditing(true);
        const obj = {id: uuid(), title: "", hints: [], easy: [], medium: [], hard: []};
        setEditChallenge(obj);
    }


    const handleEdit = (e) => {
        const id = e.target.id;
        for (var i = 0; i < userChallenges.length; i++) {
            if (userChallenges[i].id === id) {
                setEditing(true);
                setChallengeName(userChallenges[i].title)
                setEditChallenge(userChallenges[i]);
                break;
            }
        }
    }

    const handleDelete = async(e) => {
        const deleteConfirm = window.confirm(`Are you sure you want to delete "${editChallenge.title}" ?`);
        if (!deleteConfirm) return;
        else {
            // delete from user challenges
            var moduserChal = [...userChallenges];
            for( var i = 0; i <  moduserChal.length; i++) {
                if ( moduserChal[i].id === editChallenge.id) moduserChal.splice(i, 1); 
                
            }

            setUserChallenges(moduserChal);
            setEditChallenge(null);
            setEditing(false);

            // save to firebase
            const userDocumentRef = firestore.collection("users").doc(userID);
 
            const setWithMerge = await userDocumentRef.set({
                created_challenges: moduserChal,
            }, { merge: true });
            
            window.location='/custom';
            
            return true;

        }
    }

    const easyEnter = (e) => {
        if (e.keyCode === 13) {
            setEditChallenge({
                ...editChallenge,
                easy: [...editChallenge.easy, editEasy]
             })
            setEditEasy("");
        }
    }

    const mediumEnter = (e) => {
        if (e.keyCode === 13) {
            setEditChallenge({
                ...editChallenge,
                medium: [...editChallenge.medium, editMedium]
             })
            setEditMedium("");
        }
    }

    const hardEnter = (e) => {
        if (e.keyCode === 13) {
            setEditChallenge({
                ...editChallenge,
                hard: [...editChallenge.hard, editHard]
             })
            setEditHard("");
        }
    }

    const hintEnter = (e) => {
        if (e.keyCode === 13) {
            setEditChallenge({
                ...editChallenge,
                hints: [...editChallenge.hints, editHint]
             })
            setEditHint("");
        }
    }

    const removeWord = (e) => {
        const word = e.target.innerHTML;

        const deleteConfirm = window.confirm(`Delete: "${word}" ?`);
        if (!deleteConfirm) return;

        const modEditChal = { ...editChallenge };
        
        // easy
        for( var i = 0; i < modEditChal.easy.length; i++) {
            if ( modEditChal.easy[i] === word) modEditChal.easy.splice(i, 1); 
            
        }

        // medium
        for( var i = 0; i < modEditChal.medium.length; i++) {
            if ( modEditChal.medium[i] === word) modEditChal.medium.splice(i, 1); 
            
        }

        // hard
        for( var i = 0; i < modEditChal.hard.length; i++) {
            if ( modEditChal.hard[i] === word) modEditChal.hard.splice(i, 1); 
            
        }
        
        // hint
        for( var i = 0; i < modEditChal.hints.length; i++) {
            if ( modEditChal.hints[i] === word) modEditChal.hints.splice(i, 1); 
            
        }

        setEditChallenge(modEditChal);
    }

    const saveToDB = async(e) => {
        if (addNewChallenge) {
            const userDocumentRef = firestore.collection("users").doc(userID);

            const setWithMerge = await userDocumentRef.set({
                created_challenges: [...userChallenges, editChallenge],
            }, { merge: true });
                
            window.location='/custom';
                
            return true;
        } else {
            const modUserChal = userChallenges;
            for (var i = 0; i < userChallenges.length; i++) {
                console.log(modUserChal[i], editChallenge.id)
                if (modUserChal[i].id === editChallenge.id) {
                    modUserChal[i].title = challengeName;
                    modUserChal[i].easy = editChallenge.easy;
                    modUserChal[i].medium = editChallenge.medium;
                    modUserChal[i].hard = editChallenge.hard;
                    modUserChal[i].hints = editChallenge.hints
                    break;
                }
            }
        
            
            const userDocumentRef = firestore.collection("users").doc(userID);
            try {
                const setWithMerge = await userDocumentRef.set({
                    created_challenges: modUserChal,
                }, { merge: true });
                
                window.location='/custom';
                
                return true;

            } catch(e) {
                console.log(e);
                return false;
            }
        }
    }

    const handleTitleEdit = (value) => {
        setChallengeName(value);
        setEditChallenge({...editChallenge, title: value});
    }
    
    const playChallenge = async() => {
        if (challengeIDToPlay === "") return;
        const query = await queryCollectionDB("users")
        query.forEach( async(user) => {
            const challenges = await user.data().created_challenges;
            for (var i = 0; i < challenges.length; i++) {
                if (challenges[i].id === challengeIDToPlay) {
                    setChallengeToPlay(challenges[i]);
                    setPlay(true);
                    setValue(-1);
                    break;
                }
            }
        });
    }

    console.log(challengeToPlay);

    return (
        <div>
            {/* Header */}
            {
                (value === 1 || value === 0) ?
            <header className="custom">
                <a href='/'>
                    <span className="back-arrow">
                        <i className="fas fa-arrow-left"></i>
                    </span>
                </a>
                <img src={BisonLogo} alt="Bison Logo"></img>

            </header>
            :
            <></>
            }

            {
                (value === 1) ? <h1 style={{margin: "30px"}}>Your Challenges<span onClick={() => handleAddChallenge()}style={{marginLeft: "15px", cursor: "pointer"}}><i className="fas fa-plus-square"></i></span></h1> :
                <div></div>
            }

            {value === 1 ? 
                userChallenges.map((challenge, index) => {
                    return (
                        <div className="user-challenges" key={index}>
                            <div style={{marginBottom: "20px"}}>
                                <span style={{fontSize: "20px"}}>
                                    {challenge.title}
                                    <span style={{marginRight: "10px", marginLeft: "10px"}}><i id={challenge.id} onClick={(e) => handleEdit(e)} className="fas fa-edit"></i></span>
                                    {(editing) ? <span onClick={(e) => handleDelete(e)}><i className="fas fa-trash-alt"></i></span> : <></>}
                                </span>
                            </div>
                        </div>
                        )
                }) 
                : 
                (value === 0) ? 
                    <div>
                        <h1>Play a challenge</h1>
                        <h4>Enter a challenge ID: </h4>
                        <div>
                        <Select
                            labelId="difficulty"
                            id="difficulty-label"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            >
                            <MenuItem value={EASY_DIFFICULTY}>Easy</MenuItem>
                            <MenuItem value={MEDIUM_DIFFICULTY}>Medium</MenuItem>
                            <MenuItem value={HARD_DIFFICULTY}>Hard</MenuItem>
                            </Select>
                            <TextField value={challengeIDToPlay} placeholder="Challenge ID" onChange={(e) => setChallengeIDToPlay(e.target.value)} onKeyUp={hintEnter} variant="filled"></TextField>
                            <Button variant="contained"onClick={() => playChallenge(challengeIDToPlay)}>Play Challenge</Button>
                        </div>
                    </div>
                    :
                    <></>
            
            }

            {/* Editing */}
            { (editing) ?
            <div style={{marginBottom: "25px"}}>
                <h5>Editing Title: {<TextField value={challengeName} placeholder="Give a challenge name..."onChange={(e) => handleTitleEdit(e.target.value)} variant="filled"></TextField>} | ID: {editChallenge.id}</h5>
                <div>    
                    <h5>Easy</h5>
                    {editChallenge.easy.map((word, index) => {
                        return <span onDoubleClick={(e) => removeWord(e)} className="custom-edit-word" key={index}>{word}</span>
                    })}
                    <TextField value={editEasy} onChange={(e) => setEditEasy(e.target.value)} onKeyUp={easyEnter} variant="filled"></TextField>
                </div>

                <div>
                <h5>Medium</h5>
                    {editChallenge.medium.map((word, index) => {
                        return <span onDoubleClick={(e) => removeWord(e)} className="custom-edit-word" key={index}>{word}</span>
                    })}
                    <TextField value={editMedium} onChange={(e) => setEditMedium(e.target.value)} onKeyUp={mediumEnter} variant="filled"></TextField>
                </div>

                <div>
                    <h5>Hard</h5>
                    {editChallenge.hard.map((word, index) => {
                        return <span onDoubleClick={(e) => removeWord(e)} className="custom-edit-word" key={index}>{word}</span>
                    })}
                    <TextField value={editHard} onChange={(e) => setEditHard(e.target.value)} onKeyUp={hardEnter} variant="filled"></TextField>
                </div>

                <div style={{marginBottom: "25px"}}>
                    <h5>Hints</h5>
                    {editChallenge.hints.map((word, index) => {
                        return <span onDoubleClick={(e) => removeWord(e)} className="custom-edit-word" key={index}>{word}</span>
                    })}
                    
                </div>
                <Button onClick={saveToDB} variant="contained">Save</Button>
                <Button onClick={() => setEditing(false)} variant="contained">Cancel</Button>
            </div> 
            : 
            <></> }

            {
                (play) ?
                <SPGame userChallenge={true} difficulty={difficulty} challenge={challengeToPlay} />
                :
                <></>
            }


            {/* Navigation */}
            {
                (value === 1 || value === 0) ?
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className="custom-navigation"
            >
                <BottomNavigationAction label="Play" icon={<Icon className="fas fa-play"/>} />
                <BottomNavigationAction label="Create"  icon={<Icon className="fas fa-plus"/>}/>
            </BottomNavigation>
            : <></>
            }
        </div>
    )
}
