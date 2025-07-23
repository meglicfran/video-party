import { MsgType, sendPayload } from "../App";
import { useWebSocketContext } from "./WebSocketContext";

interface Prop {
	roomNumber: number;
}

function LeaveRoomControl({ roomNumber }: Prop) {
	const ws = useWebSocketContext();

	const leaveRoomClickHandler = () => {
		ws.current
			? sendPayload(MsgType.LEAVE, String(roomNumber), null, null, null, ws.current)
			: console.log("No socket");
	};

	return (
		<div className="room-container">
			<h2>Room:</h2>
			<h2 id="room-number">{String(roomNumber)}</h2>
			<button className="button" id="leave" onClick={leaveRoomClickHandler}>
				Leave room
			</button>
		</div>
	);
}

export default LeaveRoomControl;
