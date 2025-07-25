import LeaveRoomControl from "./LeaveRoomControl";
import VideoPlayer from "./VideoPlayer";
import { useState } from "react";
import VideoSelect from "./VideoSelect";

interface Prop {
	roomNumber: number;
}

function MainScreen({ roomNumber }: Prop) {
	const [videoSrc, updateVideoSrc] = useState("/flower.webm");

	const handleSrcChange = (fileUrl: string) => {
		updateVideoSrc(fileUrl);
	};

	return (
		<div className={roomNumber == -1 ? "hidden" : "app-container"} id="app-container">
			<VideoPlayer videoSrc={videoSrc} />
			<div className="room-src-container">
				<LeaveRoomControl roomNumber={roomNumber} />
				<VideoSelect onSrcChange={handleSrcChange} />
			</div>
		</div>
	);
}

export default MainScreen;
