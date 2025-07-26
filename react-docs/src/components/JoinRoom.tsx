import { useState } from "react";
import { useWebSocketContext } from "./WebSocketContext";
import { MsgType, sendPayload } from "../App";

interface Prop {
	room: string;
}

function JoinRoom({ room }: Prop) {
	const ws = useWebSocketContext();
	const [inputValue, setInputValue] = useState("");

	const clickHandler = () => {
		ws.current
			? sendPayload(MsgType.JOIN, String(inputValue), null, null, null, ws.current)
			: console.log("No socket");
	};

	return (
		<div className={room == "" ? "" : "hidden"} id="join-container">
			<div className="join-room">
				<input
					type="text"
					id="room-number-input"
					className="number-input"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
					}}
				/>
				<button className="button-secondary" id="join" onClick={clickHandler}>
					Join room
				</button>
			</div>
		</div>
	);
}

export default JoinRoom;
