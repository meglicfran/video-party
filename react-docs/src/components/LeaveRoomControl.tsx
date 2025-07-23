interface Prop {
	roomNumber: number;
	onLeaveRoom: (room: number) => void;
}

function LeaveRoomControl({ roomNumber, onLeaveRoom }: Prop) {
	const leaveRoomClickHandler = () => {
		console.log(
			"LeaveRoomControl component: trying to leave room " + roomNumber
		);
		onLeaveRoom(roomNumber);
	};

	return (
		<div className="room-container">
			<h2>Room:</h2>
			<h2 id="room-number">{String(roomNumber)}</h2>
			<button
				className="button"
				id="leave"
				onClick={leaveRoomClickHandler}
			>
				Leave room
			</button>
		</div>
	);
}

export default LeaveRoomControl;
