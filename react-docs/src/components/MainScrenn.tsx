import LeaveRoomControl from "./LeaveRoomControl";
import VideoControl from "./VideoControl";
import VideoPlayer from "./VideoPlayer";

import type { VideoState } from "../App";

import { VideoContext } from "./VideoContext";
import { useRef } from "react";

interface Prop {
	roomNumber: number;
	onLeaveRoom: (room: number) => void;
	videoState: VideoState;
	onPorgresBarClick: (paused: boolean, currentTime: number, duration: number) => void;
	onDurationDiff: () => void;
	onPlayClicked: (currentTIme: number) => void;
	onStopClicked: (currentTIme: number) => void;
}

function MainScreen({
	roomNumber,
	onLeaveRoom,
	videoState,
	onPorgresBarClick,
	onDurationDiff,
	onPlayClicked,
	onStopClicked,
}: Prop) {
	const currentTime = useRef(videoState.currentTime);

	const updateCurrentTime = (time: number) => {
		currentTime.current = time;
	};

	return (
		<div className={roomNumber == -1 ? "hidden" : ""} id="app-container">
			<LeaveRoomControl roomNumber={roomNumber} onLeaveRoom={onLeaveRoom} />
			<VideoContext.Provider value={{ currentTime, updateCurrentTime }}>
				<VideoPlayer
					videoState={videoState}
					onPorgresBarClick={onPorgresBarClick}
					onDurationDiff={onDurationDiff}
				/>
				<VideoControl onPlayClicked={onPlayClicked} onStopClicked={onStopClicked} />
			</VideoContext.Provider>
			<div className="select-container">
				<label>Select video</label>
				<input className="button" type="file" accept="video/*" id="fileInput" />
				<button className="button" id="submit">
					Select
				</button>
			</div>
		</div>
	);
}

export default MainScreen;
