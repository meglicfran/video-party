import { MsgType, sendPayload } from "../App";
import { useVideoContext } from "./VideoContext";
import { useWebSocketContext } from "./WebSocketContext";

function VideoControl() {
	const ws = useWebSocketContext();
	const timeRef = useVideoContext().currentTime;
	const durationRef = useVideoContext().durationRef;

	const playClickHandler = () => {
		const time = timeRef.current;
		const duration = durationRef.current;
		ws.current ? sendPayload(MsgType.SYNC, null, false, time, duration, ws.current) : console.log("No socket");
	};

	const stopClickHandler = () => {
		const time = timeRef.current;
		const duration = durationRef.current;
		ws.current ? sendPayload(MsgType.SYNC, null, true, time, duration, ws.current) : console.log("No socket");
	};

	return (
		<div className="button-container">
			<button className="button" id="play" onClick={playClickHandler}>
				Play
			</button>
			<button className="button" id="stop" onClick={stopClickHandler}>
				Stop
			</button>
		</div>
	);
}

export default VideoControl;
