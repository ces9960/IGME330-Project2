//same as homework for now, will update as needed

let audioCtx;

let element, sourceNode, analyserNode, gainNode;

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 32 //reduced from 256 to 32 so it works better with the game
});

let audioData = new Uint8Array(DEFAULTS.numSamples/2);

function setupWebAudio(filePath){
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    element = new Audio();

    loadSoundFile(filePath);

    sourceNode = audioCtx.createMediaElementSource(element);

    analyserNode = audioCtx.createAnalyser();

    analyserNode.fftSize = DEFAULTS.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);;
    gainNode.connect(audioCtx.destination);
}

function loadSoundFile(filePath){
    element.src = filePath;
}

function playCurrentSound(){
    element.play();
}

function pauseCurrentSound(){
    element.pause();
}

function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

export{audioCtx,setupWebAudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume,analyserNode,DEFAULTS};