interface VideoState {
	paused: boolean;
	currentTime: number;
	src: string;
}
interface Prop {}

function VideoControl({}: Prop) {
	return (
		<div className="button-container">
			<button className="button" id="play">
				Play
			</button>
			<button className="button" id="stop">
				Stop
			</button>
		</div>
	);
}

export default VideoControl;
