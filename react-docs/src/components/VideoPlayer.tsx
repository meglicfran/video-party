import { useEffect, useRef, type MouseEvent } from "react";
import { MsgType, sendPayload, type VideoState } from "../App";
import { useWebSocketContext } from "./WebSocketContext";
import { useVideoContext } from "./VideoContext";

interface Prop {
	videoSrc: string;
}

function VideoPlayer({ videoSrc }: Prop) {
	const ws = useWebSocketContext();
	const videoState = useVideoContext().videoState.current;
	const videoPlayer = useRef<HTMLVideoElement>(null);
	const progressBar = useRef<HTMLDivElement>(null);
	const progressContainer = useRef<HTMLDivElement>(null);

	/* Video state change */
	useEffect(() => {
		if (!videoPlayer.current) return;

		if (
			videoPlayer.current.duration &&
			videoState.duration &&
			videoPlayer.current.duration !== videoState.duration
		) {
			videoPlayer.current.currentTime = 0;
			videoPlayer.current.pause();
			ws.current
				? sendPayload(
						MsgType.ERROR,
						"Video durations differ",
						true,
						0,
						videoPlayer.current.duration,
						ws.current
				  )
				: console.log("No socket");
		}

		videoPlayer.current.currentTime = videoState.currentTime;
		videoState.paused ? videoPlayer.current.pause() : videoPlayer.current.play();
	}, [videoState]);

	/*Video source change*/
	useEffect(() => {
		if (!videoPlayer.current) return;

		videoPlayer.current.src = videoSrc;
		videoPlayer.current.load();
	}, [videoSrc]);

	const timeUpdateHandler = () => {
		if (videoPlayer.current && progressBar.current) {
			const percent = (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100;
			progressBar.current.style.width = String(percent) + "%";
		}
	};

	const handleProgressBarClick = (e: MouseEvent) => {
		if (!progressContainer.current || !videoPlayer.current) {
			return;
		}

		const rect = progressContainer.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percent = x / rect.width;
		videoPlayer.current.currentTime = percent * videoPlayer.current.duration;
		ws.current
			? sendPayload(
					MsgType.SYNC,
					null,
					videoPlayer.current.paused,
					videoPlayer.current.currentTime,
					videoPlayer.current.duration,
					ws.current
			  )
			: console.log("No socket");
	};

	const playClickHandler = () => {
		if (!videoPlayer.current) return;
		const time = videoPlayer.current.currentTime;
		const duration = videoPlayer.current.duration;
		ws.current ? sendPayload(MsgType.SYNC, null, false, time, duration, ws.current) : console.log("No socket");
	};

	const stopClickHandler = () => {
		if (!videoPlayer.current) return;
		const time = videoPlayer.current.currentTime;
		const duration = videoPlayer.current.duration;
		ws.current ? sendPayload(MsgType.SYNC, null, true, time, duration, ws.current) : console.log("No socket");
	};

	return (
		<>
			<div className="player-container">
				<video id="player" ref={videoPlayer} onTimeUpdate={timeUpdateHandler}>
					<source src={videoSrc} type="video/webm" />
					<p>Error loading video</p>
				</video>
			</div>
			<div className="progress-container" onClick={handleProgressBarClick} ref={progressContainer}>
				<div className="progress-bar" id="progress-bar" ref={progressBar}></div>
			</div>
			<div className="button-container">
				<button className="button" id="play" onClick={playClickHandler}>
					Play
				</button>
				<button className="button" id="stop" onClick={stopClickHandler}>
					Stop
				</button>
			</div>
		</>
	);
}

export default VideoPlayer;
