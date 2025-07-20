import { useEffect, useRef } from "react";

interface VideoState {
	paused: boolean;
	currentTime: number;
	src: string;
}
interface Prop {
	videoState: VideoState;
	onTimeUpdate: (percent: number) => void;
}

function VideoPlayer({ videoState, onTimeUpdate }: Prop) {
	const videoPlayer = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoPlayer.current) {
			videoPlayer.current.currentTime = videoState.currentTime;
		}
		videoState.paused
			? videoPlayer.current?.pause()
			: videoPlayer.current?.play();
	});

	const timeUpdateHandler = () => {
		if (videoPlayer.current) {
			const percent =
				(videoPlayer.current.currentTime /
					videoPlayer.current.duration) *
				100;
			onTimeUpdate(percent);
		}
	};

	return (
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
	);
}

export default VideoPlayer;
