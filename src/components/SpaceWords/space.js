// @flow
import React, { Component } from 'react';
import './space.css';

//function for initializing blue square - the starship
function Starship(props) {
        let stats = {
            left: props.x,
            top: props.y,
        };
        return <div draggable="false" style={stats} className="ship"/>;
}

//main class responsible for the whole <Game/> component
class Game extends Component {
    
    //declaration of variables for flow
    state = {
        parent_width: 0,
        parent_height: 0,
        score_text: "",
        score: 0,
        ship_x: 0,
        ship_y: 0,
        test_fired: false,
        test_moved: false,
        cooling: 0,
        beam_x: 0,
        beam_y: 0,
        beam_visibility: "",
        asteroid_x: 0,
        asteroid_y: 0,
        asteroid_speed: 0,
        bonus_x: 0,
        bonus_y: 0,
        bonus_visibility: "",
        game_over: false,
        evil_x: 0,
        evil_y: 0,
        evil_visibility: "",
        char: "",
    }

    intervalId: 0;

    //constructor method with all used properties set into the state
    constructor() {
        super();
        this.state = {
            parent_width: 800,
            parent_height: 800,
            score_text: "Score: ",
            score: 0,
            ship_x: 135,
            ship_y: 440,
            test_fired: false,
            test_moved: false,
            cooling: 0,
            beam_x: 310,
            beam_y: 0,
            beam_visibility: 'hidden',
            asteroid_x: Math.floor(Math.random()*6)*50,
            asteroid_y: 0,
            asteroid_speed: 1,
            bonus_x: 310,
            bonus_y: 0,
            bonus_visibility: 'hidden',
            game_over: false,
            evil_x: 310,
            evil_y: 0,
            evil_visibility: 'hidden',
            bonusChar: "",
        };
    }
}