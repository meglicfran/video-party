import { useState } from "react";
import { useWebSocketContext } from "./WebSocketContext";
import { MsgType, sendPayload } from "../App";

interface Prop {
	roomNumber: Number;
}

function JoinRoom({ roomNumber }: Prop) {
	const ws = useWebSocketContext();
	const [inputValue, setInputValue] = useState("");

	const clickHandler = () => {
		const inputValueNum = Number(inputValue);
		if (isNaN(inputValueNum)) {
			console.error("JoinRoom component: Invalid number!");
			return;
		}

		ws.current
			? sendPayload(MsgType.JOIN, String(inputValueNum), null, null, null, ws.current)
			: console.log("No socket");
	};

	return (
		<div className={roomNumber != -1 ? "hidden" : ""} id="join-container">
			<div className="join-room">
				<input
					type="number"
					id="room-number-input"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
					}}
				/>
				<button className="button" id="join" onClick={clickHandler}>
					Join room
				</button>
			</div>
		</div>
	);
}

export default JoinRoom;
