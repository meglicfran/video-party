console.log("Hello!")

const videoPlayer = document.getElementById("player")
const statusText = document.getElementById("status")
const playButton = document.getElementById("play")
const stopButton = document.getElementById("stop")
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');    

/*
var seekButton = document.getElementById("seek-button")
var seekInput = document.getElementById("seek")
*/

videoPlayer.addEventListener('timeupdate', () => {
  const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.style.width = percent + '%';
});

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = x / rect.width;
  videoPlayer.currentTime = percent * videoPlayer.duration;
});


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

