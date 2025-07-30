import Toast, { showToast } from "./components/Toast";
import JoinRoom from "./components/JoinRoom";
import MainScreen from "./components/MainScrenn";
import { useEffect, useState, useRef } from "react";
import { WebSocketContext } from "./components/WebSocketContext";
import Title from "./components/Title";
import { VideoContext } from "./components/VideoContext";
import CreateRoom from "./components/CreateRoom";

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
	CREATE,
}

function App() {
	const [, updateVideoState] = useState<VideoState>({
		paused: true,
		currentTime: 0,
		duration: 5.059,
	});

	const [currentRoom, updateCurrentRoom] = useState<string>("");

	const videoStateRef = useRef<VideoState>({ paused: true, currentTime: 0, duration: 5.059 });

	const updateVideoStateContext = (newState: VideoState) => {
		videoStateRef.current = newState;
	};

	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket("wss://websocket-server-9tc2.onrender.com");
		ws.current.onopen = () => {
			console.log("Connected to server");
			showToast("Connected to server");
		};

		ws.current.onmessage = (event) => {
			var payloadObj: Payload = JSON.parse(event.data);
			console.log("Message from server:", payloadObj);

			if (payloadObj.type == MsgType.ERROR) {
				showToast(payloadObj.message);
			} else if (payloadObj.type == MsgType.JOIN) {
				updateCurrentRoom(payloadObj.message);
			} else if (payloadObj.type == MsgType.LEAVE) {
				updateCurrentRoom("");
			} else if (payloadObj.type == MsgType.SYNC) {
				handleSync(payloadObj);
			}
		};

		return () => {
			ws.current?.close();
		};
	}, []);

	const handleSync = (payloadObj: Payload) => {
		updateVideoState({
			paused: payloadObj.paused,
			currentTime: payloadObj.currentTime,
			duration: payloadObj.duration,
		});
		updateVideoStateContext({
			paused: payloadObj.paused,
			currentTime: payloadObj.currentTime,
			duration: payloadObj.duration,
		});
	};
	return (
		<>
			<WebSocketContext value={ws}>
				<VideoContext value={{ videoState: videoStateRef, updateVideoStateContext }}>
					<Toast />
					<Title room={currentRoom} title={"Video Party"} />
					<CreateRoom room={currentRoom} />
					<JoinRoom room={currentRoom} />
					<MainScreen room={currentRoom} />
				</VideoContext>
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
