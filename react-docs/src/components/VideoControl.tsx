import { useVideoContext } from "./VideoContext";

interface Prop {
	onPlayClicked: (currentTIme: number) => void;
	onStopClicked: (currentTIme: number) => void;
}

function VideoControl({ onPlayClicked, onStopClicked }: Prop) {
	const timeRef = useVideoContext().currentTime;

	const playClickHandler = () => {
		const time = timeRef.current;
		onPlayClicked(time);
	};

	const stopClickHandler = () => {
		const time = timeRef.current;
		onStopClicked(time);
	};

	return (
		<div className="button-container">
			<button className="button" id="play" onClick={playClickHandler}>
				Play
			</button>
			<button className="button" id="stop" onClick={stopClickHandler}>
				Stop
			</button>
		</div>
	);
}

export default VideoControl;
