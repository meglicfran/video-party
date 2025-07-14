console.log("Hello!")

const videoPlayer = document.getElementById("player")
const playButton = document.getElementById("play")
const stopButton = document.getElementById("stop")
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');    

/* Custom video controlls event listeners */
videoPlayer.addEventListener('timeupdate', () => {
  const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.style.width = percent + '%';
});

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = x / rect.width;
  videoPlayer.currentTime = percent * videoPlayer.duration;
  printState();
  sendState();
});

playButton.addEventListener("click", (event) => {
    console.log("Play button clicked!")
    if(!videoPlayer.paused) return;
    videoPlayer.play();
    printState();
    sendState();
})

stopButton.addEventListener("click", (event) => {
    console.log("Stop button clicked!")
    if(videoPlayer.paused) return;
    videoPlayer.pause();
    printState();
    sendState();
})

/* Websocket event listeners */
const ws = new WebSocket('ws://localhost:8080')
ws.onopen = () => {
    console.log('Connected to server');
};

ws.onmessage = (event) => {
    var stateObj = JSON.parse(event.data)
    console.log('Message from server:', stateObj);
    videoPlayer.currentTime = stateObj.currentTime;
    stateObj.paused ? videoPlayer.pause() : videoPlayer.play();
};

ws.onclose = () => {
    console.log('Disconnected from server');
};

function sendState() {
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
}

function printState(){
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    console.log(payloadObj)
}

