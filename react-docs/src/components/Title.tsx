interface Prop {
	roomNumber: number;
	title: string;
}

function Title({ roomNumber, title }: Prop) {
	return (
		<div className={roomNumber == -1 ? "title-container" : "title-container hidden"}>
			<h1 className="title">{title}</h1>
		</div>
	);
}

export default Title;
