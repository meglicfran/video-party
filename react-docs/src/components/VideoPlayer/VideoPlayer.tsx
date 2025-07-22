import { useEffect, useRef, type MouseEvent } from "react";

interface VideoState {
	paused: boolean;
	currentTime: number;
	src: string;
}
interface Prop {
	videoState: VideoState;
	onPorgresBarClick: (
		paused: boolean,
		currentTime: number,
		duration: number
	) => void;
}

function VideoPlayer({ videoState, onPorgresBarClick }: Prop) {
	const videoPlayer = useRef<HTMLVideoElement>(null);
	const progressBar = useRef<HTMLDivElement>(null);
	const progressContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (videoPlayer.current) {
			videoPlayer.current.currentTime = videoState.currentTime;
		}
		videoState.paused
			? videoPlayer.current?.pause()
			: videoPlayer.current?.play();
	});

	const timeUpdateHandler = () => {
		if (videoPlayer.current && progressBar.current) {
			const percent =
				(videoPlayer.current.currentTime /
					videoPlayer.current.duration) *
				100;
			progressBar.current.style.width = String(percent) + "%";
		}
	};

	const handleProgressBarClick = (e: MouseEvent) => {
		if (!progressContainer.current || !videoPlayer.current) {
			return;
		}
		//console.log(e.nativeEvent.target);

		const rect = progressContainer.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percent = x / rect.width;
		videoPlayer.current.currentTime =
			percent * videoPlayer.current.duration;
		onPorgresBarClick(
			videoPlayer.current.paused,
			videoPlayer.current.currentTime,
			videoPlayer.current.duration
		);
	};

	return (
		<>
			<div className="player-container">
				<video
					id="player"
					ref={videoPlayer}
					onTimeUpdate={timeUpdateHandler}
				>
					<source src={videoState.src} type="video/webm" />
					<p>Error loading video</p>
				</video>
			</div>
			<div
				className="progress-container"
				onClick={handleProgressBarClick}
				ref={progressContainer}
			>
				<div
					className="progress-bar"
					id="progress-bar"
					ref={progressBar}
				></div>
			</div>
		</>
	);
}

export default VideoPlayer;
