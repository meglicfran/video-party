console.log("Hello!")

const WebSocket = require("ws");
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

var clients = []

function printClientIds(){
    ids = []
    for(var client of clients){
        ids.push(client.id)
    }
    console.log(ids)
}

wss.on('connection', (ws) => {
    ws.id = uuidv4();
    clients.push(ws);
    console.log('Client connected ' + ws.id);
    printClientIds()

    // Receive message from client
    ws.on('message', (rawData) => {
        var message = rawData.toString();
        var log = 'From ' + ws.id + ' Received:' + message;
        console.log(log);

        for (var client of clients) {
            //if(client.id === ws.id) continue;
            client.send(message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter((client) => {
            return client.id !== ws.id
        })
        printClientIds()
    });
});