import LeaveRoomControl from "./LeaveRoomControl";
import VideoPlayer from "./VideoPlayer";
import { useState } from "react";
import VideoSelect from "./VideoSelect";

interface Prop {
	room: string;
}

function MainScreen({ room }: Prop) {
	const [videoSrc, updateVideoSrc] = useState("/flower.webm");

	const handleSrcChange = (fileUrl: string) => {
		updateVideoSrc(fileUrl);
	};

	return (
		<div className={room == "" ? "hidden" : "app-container"} id="app-container">
			<VideoPlayer videoSrc={videoSrc} />
			<div className="room-src-container">
				<LeaveRoomControl room={room} />
				<VideoSelect onSrcChange={handleSrcChange} />
			</div>
			<h1>{`Room: ${room}`}</h1>
		</div>
	);
}

export default MainScreen;
