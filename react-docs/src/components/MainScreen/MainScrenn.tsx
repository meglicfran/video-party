function MainScreen() {
	return (
		<div className="" id="app-container">
			<div className="room-container">
				<h2>Room:</h2>
				<h2 id="room-number">8</h2>
				<button className="button" id="leave">
					Leave room
				</button>
			</div>
			<div className="player-container">
				<video id="player">
					<source src="/flower.webm" type="video/webm" />
					<p>Error loading video</p>
				</video>
			</div>
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
