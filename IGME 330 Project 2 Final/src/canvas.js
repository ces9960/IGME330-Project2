/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

//canvas file is the same as the homework for now, will be updated as needed

import * as utils from './utils.js';
import * as player from './player.js';

const drawParams = {
    showGradient: true,
    showBars: true,
    showCircles: true,
    showNoise: true,
    showInvert: true,
    showEmboss: true
};

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData,counter;

let circles = [];
const circleSpeed = 5;

//after COUNTER_MAX frames, spawn circles in all lanes with data above a certain value
const COUNTER_MAX = 12;
//data value to spawn a circle
const SPAWN_VALUE = 128;


//circle class
class circle{
    constructor(lane){
        this.lane = lane;
        this.y = Number(0);
        if(this.y !== 0){
            this.y = parseInt(Number(0));
        }
    }
}

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
    //counter for spawning circles
    counter = 0;
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);
        ctx.restore();
    }
    // 4 - draw bars
    if(params.showBars){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.50)';
        ctx.strokeStyle = 'rgba(0,0,0,0.50)';
    
    //loop through the data and draw
        for(let i = 0; i < audioData.length; i++){
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
        }

        //Call manageCircles()
        manageCircles(audioData,margin,barWidth,barSpacing);

        //Draw player rectangle
        ctx.save();
        player.setPlayerX(margin + player.playerLane * (barWidth + barSpacing) + (barWidth/2) - (player.playerWidth/2));
        ctx.fillStyle = 'rgba(0,0,255,1.0)';
        ctx.strokeStyle = 'rgba(0,0,0,1.0)';
        ctx.fillRect(player.playerX,player.playerY,player.playerWidth,player.playerHeight);
        ctx.strokeRect(player.playerX,player.playerY,player.playerWidth,player.playerHeight);
        ctx.restore();

        ctx.restore();
    }
	// 5 - draw circles (background, not avoided)
    if(params.showCircles){
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i = 0; i < audioData.length; i++){
            //red
            let percent = audioData[i] / 255;

            let circleRadius = percent * maxRadius;
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent/3.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //blue, more transparent
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent/10.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            //yellow, smaller
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent/5.0);
            ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 0.50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        ctx.restore();
    }



    // 6 - bitmap manipulation
        // TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
        // regardless of whether or not we are applying a pixel effect
        // At some point, refactor this code so that we are looping though the image data only if
        // it is necessary

        // A) grab all of the pixels on the canvas and put them in the `data` array
        // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
        // the variable `data` below is a reference to that array 
        let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight)
        let data = imageData.data;
        let length = data.length;
        let width = data.width;
        // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
        for(let i = 0; i < length; i += 4){

        
            // C) randomly change every 20th pixel to blue (changed from red)
            if(params.showNoise && Math.random() < .05){
                data[i] = data[i+1] = data[i+2] = 0;
                data[i + 2] = 255;
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                // zero out the red and green and blue channels
                // make the red channel 100% red
            } // end if

            //invert colors
            if(params.showInvert){
                let red = data[i], green = data[i+1], blue = data[i+2];
                data[i] = 255 - red;
                data[i+1] = 255 - green;
                data[i+2] = 255 - blue;
            }
        } // end for

        //emboss (doesn't work, just shows black screen)
        if(params.showEmboss){
            for(let i = 0; i < length; i++){
                if(i%4 == 3) continue; // skip alpha channel
                data[i] = 127 + 2*data[i] - data[i+4] - data[i + width *4];
            }
        }

        
        // D) copy image data back to canvas
        ctx.putImageData(imageData,0,0);
}

//handles everything about the circles that the player needs to avoid
function manageCircles(dataArray, canvasMargin, canvasBarWidth, canvasBarSpacing){
    
    //checks if counter is past the point where it should spawn circles
    if(counter >= COUNTER_MAX){
        let max = 0;
        let maxIndex = 0;
        for(let i = 0; i < dataArray.length; i++){
          if(dataArray[i] > max){
            maxIndex = i;
          }
        }
        circles.push(new circle(maxIndex));

        /*
        //loops through data array
        let i = 0;

        while(i < dataArray.length){
            if(dataArray[i] >= SPAWN_VALUE){
                circles.push(new circle(i));
                console.log(circles[i].lane);
                console.log(circles[i].y);
            }
            i++;
        }
        */
        /*
        for(let i = 0; i < dataArray.length; i++){
            //if >= the value required to spawn a circle, spawns a circle by pushing the lane/y to the circleLane and circles arrays
            if(dataArray[i] >= SPAWN_VALUE){
                circleLanes.push(i);
            }
        }

            for(let i = 0; i < dataArray.length; i++){
                //if >= the value required to spawn a circle, spawns a circle by pushing the lane/y to the circleLane and circles arrays
                if(dataArray[i] >= SPAWN_VALUE){
                    setTimeout(function(){
                        circles.push(0);
                    },1)

                }
            }
            */
            counter = 0;
   

    }


        for(let i = 0; i < circles.length; i++){ //check each circle
            if(isNaN(circles[i].y) || (!circles[i].y && circles[i].y !== 0) ){
                circles[i].y = parseInt(Number(0));
            }
            circles[i].y += circleSpeed;//moves the circles down

            //draws the circles
            ctx.save();
            ctx.fillStyle = 'rgba(255,0,255,1.0)';
            ctx.strokeStyle = 'rgba(0,0,0,1.0)';
            ctx.beginPath();
            let circleX = (canvasMargin + (canvasBarWidth/2) + circles[i].lane * (canvasBarWidth + canvasBarSpacing));
            ctx.arc(circleX, circles[i].y, canvasBarWidth/2,0,2*Math.PI,false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            if(player.checkCollision(circles[i].lane, circles[i].y)){ //if colliding with player
                //reduce player health by 1
                player.takeDamage();
                //remove the circle from the array
                circles.splice(i,1);
            }
            else if(circles[i].y >= canvasHeight){ //if a circle reaches the bottom of the screen
                //remove from the array
                circles.splice(i,1);

                //increase the player's score
                player.increaseScore();
            }
        }
    
    counter++;
}

export {setupCanvas,draw,drawParams, circles};