console.log("Hello!")

var videoPlayer = document.getElementById("player")
var statusText = document.getElementById("status")
var playButton = document.getElementById("play")
var stopButton = document.getElementById("stop")
var seekButton = document.getElementById("seek-button")
var seekInput = document.getElementById("seek")


videoPlayer.addEventListener('play', (event) => {
    console.log("Video player play event " + videoPlayer.currentTime)
    statusText.innerHTML = "Video player play event"
})

videoPlayer.addEventListener('pause', (event) => {
    console.log("Video player pause event " + videoPlayer.currentTime)
    statusText.innerHTML = "Video player pause event"
})

videoPlayer.addEventListener('seeking', (event) => {
    console.log("Video player seeking event " + videoPlayer.currentTime)
    statusText.innerHTML = "Video player seeking event"
})

videoPlayer.addEventListener('seeked', (event) => {
    console.log("Video player seeked event " + videoPlayer.currentTime)
    statusText.innerHTML = "Video player seeked event"
})

playButton.addEventListener("click", (event)=>{
    console.log("Play button clicked!")
    if(videoPlayer.paused){
        videoPlayer.play()
    }
})

stopButton.addEventListener("click", (event)=>{
    console.log("Stop button clicked!")
    if(!videoPlayer.paused){
        videoPlayer.pause()
    }
})

seekButton.addEventListener("click", (event)=>{
    console.log("Seek button clicker!")
    var seekPosition = seekInput.valueAsNumber
    if(seekPosition >= 0 && seekPosition < videoPlayer.duration){
        videoPlayer.currentTime = seekPosition
    }
})