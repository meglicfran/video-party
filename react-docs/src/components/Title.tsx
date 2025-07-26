interface Prop {
	room: string;
	title: string;
}

function Title({ room, title }: Prop) {
	return (
		<div className={room == "" ? "title-container" : "title-container hidden"}>
			<h1 className="title">{title}</h1>
		</div>
	);
}

export default Title;
