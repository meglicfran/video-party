import Toast from "./components/Toast";
import JoinRoom from "./components/JoinRoom";
import MainScreen from "./components/MainScrenn";
import { useEffect, useState, useRef } from "react";
import { WebSocketContext } from "./components/WebSocketContext";

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
interface Payload {
	type: number;
	message: string;
	paused: boolean;
	currentTime: number;
	duration: number;
}

export interface VideoState {
	paused: boolean;
	currentTime: number;
	duration: number;
}

export const enum MsgType {
	CONTROL,
	SYNC,
	ERROR,
	JOIN,
	LEAVE,
}

function App() {
	const [videoState, updateVideoState] = useState<VideoState>({
		paused: true,
		currentTime: 0,
		duration: 5.059,
	});

	const videoStateRef = useRef(videoState);
	useEffect(() => {
		videoStateRef.current = videoState;
	}, [videoState]);

	const [currentRoom, updateCurrentRoom] = useState<number>(-1);

	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket("ws://localhost:3000");
		ws.current.onopen = () => {
			console.log("Connected to server");
		};

		ws.current.onmessage = (event) => {
			var payloadObj: Payload = JSON.parse(event.data);
			console.log("Message from server:", payloadObj);

			if (payloadObj.type == MsgType.ERROR) {
				if (payloadObj.message === "Play method not allowed") {
					//videoPlayer.pause();
					//showToast("One of the users' play method is not allowed!");
				} else if (payloadObj.message === "Video durations differ") {
					//videoPlayer.currentTime = 0;
					//videoPlayer.pause();
					//showToast("Video durations differ");
				}
			} else if (payloadObj.type == MsgType.JOIN) {
				updateCurrentRoom(Number(payloadObj.message));
			} else if (payloadObj.type == MsgType.LEAVE) {
				updateCurrentRoom(-1);
			} else if (payloadObj.type == MsgType.SYNC) {
				handleSync(payloadObj);
			}

			return () => {
				ws.current?.close();
			};
		};
	}, []);

	const handleSync = (payloadObj: Payload) => {
		updateVideoState({
			paused: payloadObj.paused,
			currentTime: payloadObj.currentTime,
			duration: payloadObj.duration,
		});
	};
	return (
		<>
			<WebSocketContext value={ws}>
				<Toast />
				<JoinRoom roomNumber={currentRoom} />
				<MainScreen roomNumber={currentRoom} videoState={videoState} />
			</WebSocketContext>
		</>
	);
}

export function sendPayload(
	typeArg: Number | null,
	messageArg: string | null,
	pausedArg: boolean | null,
	currentTImeArg: Number | null,
	durationArg: Number | null,
	ws: WebSocket
) {
	const payloadObj = {
		type: typeArg,
		message: messageArg,
		paused: pausedArg,
		currentTime: currentTImeArg,
		duration: durationArg,
	};
	const payloadJSON = JSON.stringify(payloadObj);
	ws.send(payloadJSON);
}

export default App;
