console.log("Hello!")
const WebSocket = require("ws");
const { v4: uuidv4 } = require('uuid');

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
const LEAVE = 4;
const JOIN = 3;
const ERROR = 2;
const SYNC = 1;
const CONTROL = 0;

const wss = new WebSocket.Server({ port: 8080 });

var clients = new Map();
var rooms = new Map();

wss.on('connection', (ws) => {
    var clientId = uuidv4();
    clients.set(clientId, ws);
    console.log('Client connected ' + clientId);
    printClients()

    // Receive message from client
    ws.on('message', (rawData) => {
        var msgStr = rawData.toString();
        var msgObj = JSON.parse(msgStr);
        var log = 'From ' + clientId + ' Received:' + msgStr;
        console.log(log);

        if (msgObj.type === JOIN) {
            var roomNumber = msgObj.message;
            var client = clients.get(clientId);
            client.room = roomNumber;
            clients.set(clientId, client);
            addToMapArray(rooms, roomNumber, clientId);
            printMapOfArrays(rooms);
            ws.send(JSON.stringify({ type: JOIN, message: roomNumber }));
        }else if(msgObj.type === LEAVE){
            var roomNumber = msgObj.message;
            var client = clients.get(clientId);
            client.room = null;
            clients.set(clientId, client);
            removeFromMapArray(rooms, roomNumber, clientId);
            printMapOfArrays(rooms);
            ws.send(JSON.stringify({type: LEAVE, message: roomNumber }));
        } else {
            var clientRoom = clients.get(clientId).room;
            if(clientRoom == null ){
                console.log("Client "+ clientId + " is not in a room!");
                return;
            }

            var clientsInRoom = rooms.get(clientRoom);
            for (var client of clientsInRoom) {
                //if(client.id === clientId) continue;
                clients.get(client).send(msgStr);
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        removeFromMapArray(rooms, clients.get(clientId).room, clientId);
        clients.delete(clientId);
        printClients()
    });
});


function printClients() {
    console.log("Clients: ")
    for (const [key, value] of clients) {
        console.log("\t" + key + ":" + value);
    }
    console.log("---------------------------------------------------");
}

function addToMapArray(map, key, value) {
    if (!map.has(key)) {
        map.set(key, []);
    }
    map.get(key).push(value);
}

function removeFromMapArray(map, key, valueToRemove) {
  if (map.has(key)) {
    const arr = map.get(key).filter(v => v !== valueToRemove);
    map.set(key, arr);
  }
}

function printMapOfArrays(map) {
    console.log("Rooms:");
    for (const [key, values] of map.entries()) {
        console.log(`\t ${key}: [${values.join(', ')}]`);
    }
    console.log("---------------------------------------------------");
}