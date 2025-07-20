import { useState } from "react";

interface Prop {
	roomNumber: Number;
	onJoin: (roomNumber: Number) => void;
}

function JoinRoom({ roomNumber, onJoin }: Prop) {
	const [inputValue, setInputValue] = useState("");

	const clickHandler = (event: React.MouseEvent) => {
		console.log("Trying to join room: " + inputValue);
		//sendState(JOIN, roomNumberInput.valueAsNumber, null, null, null);
		const inputValueNum = Number(inputValue);
		if (isNaN(inputValueNum)) {
			console.error("JoinRoom component: Invalid number!");
			return;
		}
		onJoin(inputValueNum);
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
