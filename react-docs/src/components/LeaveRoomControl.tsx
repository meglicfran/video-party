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
		<button className="button-secondary" id="leave" onClick={leaveRoomClickHandler}>
			Leave room
		</button>
	);
}

export default LeaveRoomControl;
