import LeaveRoomControl from "./LeaveRoomControl";
import VideoControl from "./VideoControl";
import VideoPlayer from "./VideoPlayer";
import type { VideoState } from "../App";
import { VideoContext } from "./VideoContext";
import { useRef, useState } from "react";
import VideoSelect from "./VideoSelect";

interface Prop {
	roomNumber: number;
	videoState: VideoState;
}

function MainScreen({ roomNumber, videoState }: Prop) {
	const [videoSrc, updateVideoSrc] = useState("/flower.webm");

	const currentTime = useRef(videoState.currentTime);
	const durationRef = useRef(0);

	const updateCurrentTime = (time: number) => {
		currentTime.current = time;
	};

	const updateDuration = (duration: number) => {
		durationRef.current = duration;
	};

	const handleSrcChange = (fileUrl: string) => {
		updateVideoSrc(fileUrl);
	};

	return (
		<div className={roomNumber == -1 ? "hidden" : ""} id="app-container">
			<LeaveRoomControl roomNumber={roomNumber} />
			<VideoContext.Provider value={{ currentTime, durationRef, updateCurrentTime, updateDuration }}>
				<VideoPlayer videoState={videoState} videoSrc={videoSrc} />
				<VideoControl />
			</VideoContext.Provider>
			<VideoSelect onSrcChange={handleSrcChange} />
		</div>
	);
}

export default MainScreen;
