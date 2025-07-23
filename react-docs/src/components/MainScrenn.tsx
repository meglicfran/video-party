import LeaveRoomControl from "./LeaveRoomControl";
import VideoControl from "./VideoControl";
import VideoPlayer from "./VideoPlayer";
import type { VideoState } from "../App";
import { VideoContext } from "./VideoContext";
import { useRef } from "react";
import VideoSelect from "./VideoSelect";

interface Prop {
	roomNumber: number;
	videoState: VideoState;
	onInputChange: (url: string, duration: number) => void;
}

function MainScreen({ roomNumber, videoState, onInputChange }: Prop) {
	const currentTime = useRef(videoState.currentTime);

	const updateCurrentTime = (time: number) => {
		currentTime.current = time;
	};

	return (
		<div className={roomNumber == -1 ? "hidden" : ""} id="app-container">
			<LeaveRoomControl roomNumber={roomNumber} />
			<VideoContext.Provider value={{ currentTime, updateCurrentTime }}>
				<VideoPlayer videoState={videoState} />
				<VideoControl />
			</VideoContext.Provider>
			<VideoSelect onInputChange={onInputChange} />
		</div>
	);
}

export default MainScreen;
