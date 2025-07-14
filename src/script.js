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
    sendState();
});

playButton.addEventListener("click", (event) => {
    console.log("Play button clicked!")
    if (!videoPlayer.paused) return;
    /*
    videoPlayer.play();
    printState();
    sendState();
    */
    var payloadObj = { paused: false, currentTime: videoPlayer.currentTime }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
})

stopButton.addEventListener("click", (event) => {
    console.log("Stop button clicked!")
    if (videoPlayer.paused) return;
    /*
    videoPlayer.pause();
    printState();
    sendState();
    */
    var payloadObj = { paused: true, currentTime: videoPlayer.currentTime }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
})

/* Websocket event listeners */
const ws = new WebSocket('ws://localhost:8080')
ws.onopen = () => {
    console.log('Connected to server');
};

ws.onmessage = (event) => {
    var stateObj = JSON.parse(event.data)
    console.log('Message from server:', stateObj);

    if (stateObj.error === "Play method not allowed") {
        videoPlayer.pause();
        showToast("One of the users' play method is not allowed!");
        return;
    }

    var oldState = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }

    videoPlayer.currentTime = stateObj.currentTime;
    stateObj.paused ?
        videoPlayer.pause()
        :
        videoPlayer.play()
            .catch((error) => {
                console.log("Play failed:", error);
                videoPlayer.currentTime = oldState.currentTime;
                oldState.paused ? videoPlayer.pause() : videoPlayer.play();
                printState();
                sendErrorState();
            })
};

ws.onclose = () => {
    console.log('Disconnected from server');
};

function sendState() {
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
}

function sendErrorState() {
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime, error: "Play method not allowed" }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
}

function printState() {
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    console.log(payloadObj)
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}
