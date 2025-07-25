import LeaveRoomControl from "./LeaveRoomControl";
import VideoPlayer from "./VideoPlayer";
import type { VideoState } from "../App";
import { useRef, useState } from "react";
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
		<div className={roomNumber == -1 ? "hidden" : ""} id="app-container">
			<VideoPlayer videoSrc={videoSrc} />
			<LeaveRoomControl roomNumber={roomNumber} />
			<VideoSelect onSrcChange={handleSrcChange} />
		</div>
	);
}

export default MainScreen;
