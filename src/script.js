console.log("Hello!")

var videoPlayer = document.getElementById("player")
var statusText = document.getElementById("status")
var playButton = document.getElementById("play")
var stopButton = document.getElementById("stop")
/*
var seekButton = document.getElementById("seek-button")
var seekInput = document.getElementById("seek")
*/

const ws = new WebSocket('ws://localhost:8080')

var sendEvent = true;

ws.onopen = () => {
    console.log('Connected to server');
    //ws.send('Hello from client');
};

ws.onmessage = (event) => {
    var stateObj = JSON.parse(event.data)
    console.log('Message from server:', stateObj);
    sendEvent = false;
    videoPlayer.currentTime = stateObj.currentTime;
    stateObj.paused ? videoPlayer.pause() : videoPlayer.play();
    setTimeout(()=>{
        sendEvent=true;
    }, 100)
};

ws.onclose = () => {
    console.log('Disconnected from server');
};

videoPlayer.addEventListener('play', (event) => {
    //console.log("Video player play event " + videoPlayer.currentTime)
    printState()
    statusText.innerHTML = "Video player play event"
    if(sendEvent){
        sendState()
    }
})

videoPlayer.addEventListener('pause', (event) => {
    //console.log("Video player pause event " + videoPlayer.currentTime)
    printState()
    statusText.innerHTML = "Video player pause event"
    if(sendEvent){
        sendState()
    }
})
/* 
videoPlayer.addEventListener('seeking', (event) => {
    console.log("Video player seeking event " + videoPlayer.currentTime)
    statusText.innerHTML = "Video player seeking event"
    if(sendEvent){
        sendState()
    }
})

videoPlayer.addEventListener('seeked', (event) => {
    //console.log("Video player seeked event " + videoPlayer.currentTime)
    printState()
    statusText.innerHTML = "Video player seeked event"
    if(sendEvent){
        sendState()
    }
})
*/

playButton.addEventListener("click", (event) => {
    console.log("Play button clicked!")
    if (videoPlayer.paused) {
        videoPlayer.play()
    }
})

stopButton.addEventListener("click", (event) => {
    console.log("Stop button clicked!")
    if (!videoPlayer.paused) {
        videoPlayer.pause()
    }
})
/*
seekButton.addEventListener("click", (event) => {
    console.log("Seek button clicker!")
    var seekPosition = seekInput.valueAsNumber
    if (seekPosition >= 0 && seekPosition < videoPlayer.duration) {
        videoPlayer.currentTime = seekPosition
    }
})
*/

function sendState() {
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
}

function printState(){
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    console.log(payloadObj)
}

