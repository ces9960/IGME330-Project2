/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

//same as homework for now, will update as needed

//Gameplay: A/D to change lanes, try to avoid the circles that come down the lanes

import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';
import * as player from './player.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
    audio.setupWebAudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    player.setupDefaultValues;
    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  //add onclick event to button
  playButton.onclick = e => {
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

      //check if context is in suspended state
      if(audio.audioCtx.state == "suspended"){
          audio.audioCtx.resume();
      }
      console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

      //if track is currently paused, play
      if(e.target.dataset.playing == "no"){
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";//sets button text to pause
        //if track is playing, pause
      }else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";//sets button text to play
      }

      //hookup volume slider and label
      let volumeSlider = document.querySelector("#volumeSlider");
      let volumeLabel = document.querySelector("#volumeLabel");

      //add onimput event to slider
      volumeSlider.oninput = e => {
        //set gain
        audio.setVolume(e.target.value);
        //update label to match slider value
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
      };

      //set value of label to match initial value of slider
      volumeSlider = dispatchEvent(new Event("input"));

      //hookup track select
      let trackSelect = document.querySelector("#trackSelect");
      //add onchange event to select
      trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        //pause current track if playing
        if(playButton.dataset.playing == "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }

      //hookup checkboxes (not currently used)


      let gradientCB = document.querySelector("#gradientCB");
      let barsCB = document.querySelector("#barsCB");
      let circlesCB = document.querySelector("#circlesCB");

      let noiseCB = document.querySelector("#noiseCB");
      let invertCB = document.querySelector("#invertCB");
      let embossCB = document.querySelector("#embossCB");

      };
  };
    
  
} // end setupUI

function loop(){
    /* NOTE: This is temporary testing code that we will delete in Part II */
        requestAnimationFrame(loop);
        // 1) create a byte array (values of 0-255) to hold the audio data
        // normally, we do this once when the program starts up, NOT every frame
        //let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
        
        // 2) populate the array of audio data *by reference* (i.e. by its address)
        //audio.analyserNode.getByteFrequencyData(audioData);
        
        // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
            //console.log(audioData);
            
            //console.log("-----Audio Stats-----");
            //let totalLoudness =  audioData.reduce((total,num) => total + num);
            //let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
            //let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
            //let maxLoudness =  Math.max(...audioData); // ditto!
            // Now look at loudness in a specific bin
            // 22050 kHz divided by 128 bins = 172.23 kHz per bin
            // the 12th element in array represents loudness at 2.067 kHz
            //let loudnessAt2K = audioData[11]; 
            //console.log(`averageLoudness = ${averageLoudness}`);
            //console.log(`minLoudness = ${minLoudness}`);
           // console.log(`maxLoudness = ${maxLoudness}`);
            //console.log(`loudnessAt2K = ${loudnessAt2K}`);
            //console.log("---------------------");

          //sets drawParams to match checkboxes
          
          canvas.drawParams.showGradient = gradientCB.checked;
          canvas.drawParams.showBars = barsCB.checked;
          canvas.drawParams.showCircles = circlesCB.checked;
          canvas.drawParams.showNoise = noiseCB.checked;
          canvas.drawParams.showInvert = invertCB.checked;
          canvas.drawParams.showEmboss = embossCB.checked;
          
            canvas.draw(canvas.drawParams);
    }

export {init};