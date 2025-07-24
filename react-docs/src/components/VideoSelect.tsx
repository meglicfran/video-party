import { useRef } from "react";

interface Prop {
	onSrcChange: (url: string) => void;
}

function VideoSelect({ onSrcChange }: Prop) {
	const fileInput = useRef<HTMLInputElement>(null);

	const submitClickHandler = () => {
		fileInput.current?.click();
	};

	const handleInputChange = () => {
		if (!fileInput.current) return;

		if (!fileInput.current.files || fileInput.current.files.length === 0) return;

		const file = fileInput.current.files[0];
		var fileURL = window.URL.createObjectURL(file);

		onSrcChange(fileURL);
	};

	return (
		<div className="select-container">
			<label>Select video</label>
			<input
				className="button"
				type="file"
				accept="video/*"
				id="fileInput"
				ref={fileInput}
				onChange={handleInputChange}
			/>
			<button className="button" id="submit" onClick={submitClickHandler}>
				Select
			</button>
		</div>
	);
}

export default VideoSelect;
