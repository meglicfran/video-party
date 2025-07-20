interface VideoState {
	paused: boolean;
	currentTime: number;
	src: string;
}
interface Prop {
	progressBarPercent: number;
}

function VideoControl({ progressBarPercent }: Prop) {
	return (
		<>
			<div className="progress-container">
				<div className="progress-bar" id="progress-bar"></div>
			</div>
			<div className="button-container">
				<button className="button" id="play">
					Play
				</button>
				<button className="button" id="stop">
					Stop
				</button>
			</div>
		</>
	);
}

export default VideoControl;
