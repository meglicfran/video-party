import { useEffect, useRef, type MouseEvent } from "react";
import { MsgType, sendPayload } from "../App";
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
	const timeDisplay = useRef<HTMLParagraphElement>(null);
	const volumeControl = useRef<HTMLDivElement>(null);
	const volumeSlider = useRef<HTMLInputElement>(null);
	const subInput = useRef<HTMLInputElement>(null);
	const track = useRef<HTMLTrackElement>(null);

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

		videoPlayer.current.currentTime = 0;
		videoPlayer.current.pause();
	}, [videoSrc]);

	const timeUpdateHandler = () => {
		if (videoPlayer.current && progressBar.current && timeDisplay.current) {
			const percent = (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100;
			progressBar.current.style.width = String(percent) + "%";
			const curMin = String(Math.round(videoPlayer.current.currentTime / 60));
			const curSec = String(Math.round(videoPlayer.current.currentTime % 60)).padStart(2, "0");
			const min = String(Math.round(videoPlayer.current.duration / 60));
			const sec = String(Math.round(videoPlayer.current.duration % 60)).padStart(2, "0");
			timeDisplay.current.innerHTML = `${curMin}:${curSec} / ${min}:${sec}`;
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

	const stopPlayClickHandler = () => {
		if (!videoPlayer.current) return;
		const time = videoPlayer.current.currentTime;
		const duration = videoPlayer.current.duration;
		ws.current
			? sendPayload(MsgType.SYNC, null, !videoPlayer.current.paused, time, duration, ws.current)
			: console.log("No socket");
	};

	const handleSubChange = () => {
		console.log("handleSubChange called");
		console.log(`subInput.current = ${subInput.current}, track.current=${track.current}`);
		if (!subInput.current || !track.current) return;

		if (!subInput.current.files || subInput.current.files.length === 0) return;

		const subFile = subInput.current.files[0];
		const subURL = window.URL.createObjectURL(subFile);
		console.log(`subURL = ${subURL}`);
		track.current.src = subURL;
	};

	return (
		<>
			<div className="player-container">
				<video id="player" ref={videoPlayer} onTimeUpdate={timeUpdateHandler} onClick={stopPlayClickHandler}>
					<source src={videoSrc} type="video/webm" />
					<track src={"sub.srt"} kind="subtitles" label="Custom subtitles" default ref={track} />
					<p>Error loading video</p>
				</video>
				<div className="control-container">
					<button className="play-pause" id="play" onClick={stopPlayClickHandler}>
						<i className={videoState.paused ? "fa-solid fa-play" : "hidden"}></i>
						<i className={videoState.paused ? "hidden" : "fa-solid fa-pause"}></i>
					</button>
					<div className="progress-hitbox" onClick={handleProgressBarClick}>
						<div className="progress-container" ref={progressContainer}>
							<div className="progress-bar" id="progress-bar" ref={progressBar}></div>
						</div>
					</div>
					<p ref={timeDisplay} className="time-display">
						0:00
					</p>
					<div className="volume-control" ref={volumeControl}>
						<button className="volume-button">
							<i className="fa-solid fa-volume-high"></i>
						</button>
						<input
							ref={volumeSlider}
							type="range"
							id="volume-slider"
							min={0}
							max={1}
							step={0.05}
							defaultValue={1}
							onInput={() => {
								if (!videoPlayer.current) return;

								const value = Number(volumeSlider.current?.value || 1);
								videoPlayer.current.volume = value;
							}}
						/>
					</div>
					<input className="hidden" type="file" accept=".vtt" onChange={handleSubChange} ref={subInput} />
					<div
						className="cc-button"
						onClick={() => {
							subInput.current?.click();
						}}
					>
						<i className="fa-solid fa-closed-captioning"></i>
					</div>
				</div>
			</div>
		</>
	);
}

export default VideoPlayer;
