import Toast from "./components/Toast/Toast";
import JoinRoom from "./components/JoinRoom/JoinRoom";
import MainScreen from "./components/MainScreen/MainScrenn";
import { useEffect, useState, useRef, createContext } from "react";

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

interface VideoState {
	paused: boolean;
	currentTime: number;
	duration: number;
	src: string;
}

const LEAVE = 4;
const JOIN = 3;
const ERROR = 2;
const SYNC = 1;
const CONTROL = 0;

function App() {
	const [videoState, updateVideoState] = useState<VideoState>({
		paused: true,
		currentTime: 0,
		duration: 5.059,
		src: "/flower.webm",
	});

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

			if (payloadObj.type == JOIN) {
				updateCurrentRoom(Number(payloadObj.message));
				return;
			} else if (payloadObj.type == LEAVE) {
				updateCurrentRoom(-1);
				return;
			} else if (payloadObj.type == SYNC) {
				updateVideoState({
					paused: payloadObj.paused,
					currentTime: payloadObj.currentTime,
					duration: payloadObj.duration,
					src: videoState.src,
				});
				return;
			}

			return () => {
				ws.current?.close();
			};
		};
	}, []);

	const joinHandler = (room: Number) => {
		console.log("App: JoinRoom component trying to join room :" + room);
		ws.current
			? sendPayload(JOIN, String(room), null, null, null, ws.current)
			: console.log("No socket");
	};

	const leaveRoomHandler = (room: Number) => {
		console.log("App: LeaveRoomControl trying to leave room " + room);
		ws.current
			? sendPayload(LEAVE, String(room), null, null, null, ws.current)
			: console.log("No socket");
	};

	const progressBarClickHandler = (
		paused: boolean,
		currentTime: number,
		duration: number
	) => {
		console.log("App: progress bar clicked");
		ws.current
			? sendPayload(SYNC, null, paused, currentTime, duration, ws.current)
			: console.log("No socket");
	};

	const durationDiffHandler = () => {
		ws.current
			? sendPayload(
					ERROR,
					"Video durations differ",
					null,
					null,
					null,
					ws.current
			  )
			: console.log("No socket");
	};

	return (
		<>
			<Toast />
			<JoinRoom roomNumber={currentRoom} onJoin={joinHandler} />
			<MainScreen
				roomNumber={currentRoom}
				videoState={videoState}
				onLeaveRoom={leaveRoomHandler}
				onPorgresBarClick={progressBarClickHandler}
				onDurationDiff={durationDiffHandler}
			/>
		</>
	);
}

function sendPayload(
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
