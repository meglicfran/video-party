import { useState } from "react";

interface Prop {
	ws: WebSocket;
	roomNumber: Number;
	onJoin: () => void;
}

function JoinRoom({ ws, roomNumber, onJoin }: Prop) {
	const [inputValue, setInputValue] = useState("");

	const clickHandler = (event: MouseEvent) => {
		console.log("Trying to join room: " + inputValue);
		sendState(JOIN, roomNumberInput.valueAsNumber, null, null, null);
	};

	return (
		<div className={roomNumber == -1 ? "hidden" : ""} id="join-container">
			<div className="join-room">
				<input
					type="number"
					id="room-number-input"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
					}}
				/>
				<button className="button" id="join" onClick={(e) => {}}>
					Join room
				</button>
			</div>
		</div>
	);
}

export default JoinRoom;
