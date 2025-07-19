/*
Websocket message:
    {
        type: 0 (control) | 1 (sync) | 2 (error)
        message: str
        paused: true | false,
        currentTime: double,
        duration: double
    }


export function sendState(typeArg:Number, messageArg:string, pausedArg:Boolean, currentTImeArg:Number, durationArg:Number) {
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

export function sendErrorState(errorMsg) {
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
export function printState() {
    var payloadObj = { paused: videoPlayer.paused, currentTime: videoPlayer.currentTime }
    console.log(payloadObj)
}

export function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}
*/