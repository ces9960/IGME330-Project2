//handles player behavior

import * as audio from './audio.js';

//Used for drawing the player's rectangle to the canvas
let playerX; //not used for collision detection
const playerY = 350; //used for collision detection
const playerWidth = 20;//not used for collision detection
const playerHeight = 20;//used for collision detection

let playerLane; //Used to determine which lane the player is in
let score; //Tracks the player's score
let playerHealth; //Tracks how many hits the player can take before losing

const START_HEALTH = 3;
const START_LANE = 7;

document.addEventListener('keydown', function(event){
    if(!playerLane && playerLane != 0){ //really stupid but I had to specify it this way otherwise it would warp from 0 to the start
        playerLane = START_LANE;
    }
    if(event.keyCode == 65){
        console.log("A");
        if(playerLane <= 0){
            playerLane = audio.DEFAULTS.numSamples/2 - 1;;
        }
        else{
            playerLane--;
        }
        console.log(playerLane);
    }
    else if(event.keyCode == 68){
        console.log("D");
        playerLane++;
        if(playerLane >= audio.DEFAULTS.numSamples/2){
            playerLane = 0;
        }
        console.log(playerLane);
    }
});

//checks if a circle is colliding with the player's rectangle
const checkCollision = (lane, y) =>{
    if(lane == playerLane){ //checks lane
        if(y >= playerY && y <= (playerY + playerHeight)){//returns true if the center of the circle is in the same lane and between playerY and (playerY + playerHeight)
            return true;//the actual code for what happens on a collision will be in the main game loop
        }
    }
}

const setPlayerX = (value) =>{
    playerX = value;
}

const increaseScore= () =>{
    score++;
    console.log(`score: ${score}`);
}

const setupDefaultValues = () =>{
    playerLane = START_LANE;
    score = 0;
    playerHealth = START_HEALTH;
}

const takeDamage = () =>{
    playerHealth--;
    console.log(`health: ${playerHealth}`);
}

export {playerX, playerY, playerWidth, playerHeight, playerLane, score, playerHealth, checkCollision, setPlayerX, setupDefaultValues, increaseScore, takeDamage};