import { useRef } from "react";
import LeaveRoomControl from "../LeaveRoomControl/LeaveRoomControl";
import VideoControl from "../VideoControl/VideoControl";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

interface VideoState {
	paused: boolean;
	currentTime: number;
	duration: number;
	src: string;
}

interface Prop {
	roomNumber: number;
	onLeaveRoom: (room: number) => void;
	videoState: VideoState;
	onPorgresBarClick: (
		paused: boolean,
		currentTime: number,
		duration: number
	) => void;
	onDurationDiff: () => void;
}

function MainScreen({
	roomNumber,
	onLeaveRoom,
	videoState,
	onPorgresBarClick,
	onDurationDiff,
}: Prop) {
	return (
		<div className={roomNumber == -1 ? "hidden" : ""} id="app-container">
			<LeaveRoomControl
				roomNumber={roomNumber}
				onLeaveRoom={onLeaveRoom}
			/>
			<VideoPlayer
				videoState={videoState}
				onPorgresBarClick={onPorgresBarClick}
				onDurationDiff={onDurationDiff}
			/>
			<VideoControl />
			<div className="select-container">
				<label>Select video</label>
				<input
					className="button"
					type="file"
					accept="video/*"
					id="fileInput"
				/>
				<button className="button" id="submit">
					Select
				</button>
			</div>
		</div>
	);
}

export default MainScreen;
