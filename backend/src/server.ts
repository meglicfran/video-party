console.log("Hello!");
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";

/*
Websocket message:
    {
        type: 0 (control) | 1 (sync) | 2 (error)
        message: str
        paused: true | false,
        currentTime: double,
        duration: double
    }
*/
interface Payload {
	type: number;
	message: string;
	paused: boolean;
	currentTime: number;
	duration: number;
}

type Client = {
	ws: WebSocket;
	id: string;
	room: string | undefined;
};

const enum MsgType {
	CONTROL,
	SYNC,
	ERROR,
	JOIN,
	LEAVE,
	CREATE,
}

const clients = new Map<string, Client>();
const rooms = new Map<string, string[]>();

const PORT = Number(process.env.PORT) || 3000;
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
	var clientId = uuidv4();
	clients.set(clientId, { ws, id: clientId, room: undefined });
	console.log("Client connected " + clientId);
	printClients();

	// Receive message from client
	ws.on("message", (rawData) => {
		const msgStr = rawData.toString();
		const msgObj: Payload = JSON.parse(rawData.toString());
		const log = "From " + clientId + " Received:" + msgStr;
		console.log(log);

		if (msgObj.type === MsgType.JOIN) {
			if (rooms.get(msgObj.message) === undefined) {
				ws.send(JSON.stringify({ type: MsgType.ERROR, message: "Invalid room number" }));
				return;
			}
			const newClient = { ws: ws, id: clientId, room: msgObj.message };
			clients.set(clientId, newClient);
			addToMapArray(rooms, msgObj.message, clientId);
			printMapOfArrays(rooms);
			ws.send(JSON.stringify({ type: MsgType.JOIN, message: msgObj.message }));
		} else if (msgObj.type === MsgType.LEAVE) {
			const newClient = { ws: ws, id: clientId, room: undefined };
			clients.set(clientId, newClient);
			removeFromMapArray(rooms, msgObj.message, clientId);
			printMapOfArrays(rooms);
			ws.send(JSON.stringify({ type: MsgType.LEAVE, message: msgObj.message }));
		} else if (msgObj.type === MsgType.CREATE) {
			console.log(`${clientId} trying to create room.`);
			console.log(`Current rooms: ${rooms.size}`);
			if (rooms.size >= 10) {
				ws.send(JSON.stringify({ type: MsgType.ERROR, message: "No rooms left!" }));
				return;
			}
			const newRoom = uuidv4();
			const newClient = { ws: ws, id: clientId, room: newRoom };
			clients.set(clientId, newClient);
			addToMapArray(rooms, newRoom, clientId);
			printMapOfArrays(rooms);
			ws.send(JSON.stringify({ type: MsgType.JOIN, message: newRoom }));
		} else {
			const client = clients.get(clientId);
			if (client === undefined) return;
			const clientRoom = client.room;
			if (clientRoom === undefined) {
				console.log("Client " + clientId + " is not in a room!");
				return;
			}

			const clientsInRoom = rooms.get(clientRoom);
			if (clientsInRoom === undefined) return;
			for (var clientInRoomId of clientsInRoom) {
				clients.get(clientInRoomId)?.ws.send(msgStr);
			}
		}
	});

	ws.on("close", () => {
		const client = clients.get(clientId);
		if (client === undefined || client.room === undefined) return;
		console.log("Client disconnected");
		removeFromMapArray(rooms, client.room, clientId);
		clients.delete(clientId);
		printClients();
	});
});

function printClients() {
	console.log("Clients: ");
	for (const [key, value] of clients) {
		console.log("\t" + key + ":" + value);
	}
	console.log("---------------------------------------------------");
}

function addToMapArray(map: Map<string, string[]>, key: string, value: string) {
	if (!map.has(key)) {
		map.set(key, []);
	}
	map.get(key)?.push(value);
}

function removeFromMapArray(map: Map<string, string[]>, key: string, valueToRemove: string) {
	var arr = map.get(key);
	if (arr === undefined) {
		console.log("removeFromMapArray: map.get(key) === undefined");
		return;
	}

	arr = arr.filter((v) => v !== valueToRemove);
	if (arr.length == 0) {
		map.delete(key);
	} else {
		map.set(key, arr);
	}
}

function printMapOfArrays(map: Map<string, string[]>) {
	console.log("Rooms:");
	for (const [key, values] of map.entries()) {
		console.log(`\t ${key}:`);
		for (const client of values) {
			console.log(`\t\t ${client}`);
		}
	}
	console.log("---------------------------------------------------");
}
