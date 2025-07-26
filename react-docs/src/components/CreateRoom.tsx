import { MsgType, sendPayload } from "../App";
import { useWebSocketContext } from "./WebSocketContext";

interface Prop {
	room: string;
}

function CreateRoom({ room }: Prop) {
	const ws = useWebSocketContext();

	const createClickHandler = () => {
		ws.current ? sendPayload(MsgType.CREATE, null, null, null, null, ws.current) : console.log("No socket");
	};

	return (
		<div className={room == "" ? "" : "hidden"}>
			<div className="create-room">
				<button className="button-primary" onClick={createClickHandler}>
					Create Room
				</button>
			</div>
		</div>
	);
}

export default CreateRoom;
