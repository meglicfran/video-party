console.log("Hello!")
const roomNumberInput = document.getElementById("room-number-input")
const joinButton = document.getElementById("join")
const leaveButton = document.getElementById("leave")
const joinContainer = document.getElementById("join-container")
const roomNumberShow = document.getElementById("room-number")
const appContainer = document.getElementById("app-container");
const videoPlayer = document.getElementById("player")
const playButton = document.getElementById("play")
const stopButton = document.getElementById("stop")
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');
const fileInput = document.getElementById("fileInput")
const submit = document.getElementById("submit")

/*
Websocket message:
    {
        type: 0 (control) | 1 (sync) | 2 (error)
        message: str
        paused: true | false,
        currentTime: double,
        duration: double
    }
*/
const LEAVE = 4;
const JOIN = 3;
const ERROR = 2;
const SYNC = 1;
const CONTROL = 0;

/* Room controll event listeners */
joinButton.addEventListener("click", (event) => {
    console.log("Trying to join room: " + roomNumberInput.valueAsNumber);
    sendState(JOIN, roomNumberInput.valueAsNumber, null, null, null);
})

leaveButton.addEventListener("click", (event)=>{
    stopButton.click();
    console.log("Leaving room: " + roomNumberShow.innerHTML);
    sendState(LEAVE, Number(roomNumberShow.innerHTML), null, null, null);
})


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
    sendState(SYNC, null, videoPlayer.paused, videoPlayer.currentTime, videoPlayer.duration);
});

playButton.addEventListener("click", (event) => {
    console.log("Play button clicked!")
    if (!videoPlayer.paused) return;
    sendState(SYNC, null, false, videoPlayer.currentTime, videoPlayer.duration);
})

stopButton.addEventListener("click", (event) => {
    console.log("Stop button clicked!")
    if (videoPlayer.paused) return;
    sendState(SYNC, null, true, videoPlayer.currentTime, videoPlayer.duration);
})

/*  Websocket event listeners: */
const ws = new WebSocket('wss://websocket-server-9tc2.onrender.com')
ws.onopen = () => {
    console.log('Connected to server');
    joinContainer.classList.remove("hidden")
};

ws.onmessage = (event) => {
    var stateObj = JSON.parse(event.data)
    console.log('Message from server:', stateObj);

    if (stateObj.type == ERROR) {
        if (stateObj.message === "Play method not allowed") {
            videoPlayer.pause();
            showToast("One of the users' play method is not allowed!");
        } else if (stateObj.message === "Video durations differ") {
            videoPlayer.currentTime = 0;
            videoPlayer.pause();
            showToast("Video durations differ");
        }
        return;
    }

    if (stateObj.type == JOIN) {
        roomNumberShow.innerHTML = stateObj.message; 
        joinContainer.classList.add("hidden");
        appContainer.classList.remove("hidden");
        return;
    }else if(stateObj.type == LEAVE){
        roomNumberShow.innerHTML = "";
        appContainer.classList.add("hidden");
        joinContainer.classList.remove("hidden");
    }

    if (stateObj.type == SYNC) {
        handleSync(stateObj);
        return;
    }
};

function handleSync(stateObj) {
    if (videoPlayer.duration != stateObj.duration) {
        videoPlayer.currentTime = 0;
        videoPlayer.pause();
        sendErrorState("Video durations differ");
        return;
    }

    var oldState = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime };

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
                sendErrorState("Play method not allowed");
            });
}

ws.onclose = () => {
    console.log('Disconnected from server');
    showToast('Disconnected from server')
};

/* Select file*/
submit.addEventListener("click", (event) => {
    if (fileInput) fileInput.click();
})

fileInput.addEventListener("change", (event) => {
    var file = fileInput.files[0];
    console.log(file);
    var fileURL = window.URL.createObjectURL(file);
    console.log(fileURL);
    videoPlayer.src = fileURL;
})

/* Util functions */

function sendState(typeArg, messageArg, pausedArg, currentTImeArg, durationArg) {
    var payloadObj = {
        type: typeArg,
        message: messageArg,
        paused: pausedArg,
        currentTime: currentTImeArg,
        duration: durationArg
    }
    var payloadJSON = JSON.stringify(payloadObj)
    ws.send(payloadJSON)
}

function sendErrorState(errorMsg) {
    var payloadObj = {
        type: ERROR,
        message: errorMsg,
        paused: videoPlayer.paused,
        currentTime: videoPlayer.currentTime,
        duration: videoPlayer.duration
    }
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
