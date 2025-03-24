const WebSocket = require('ws');

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received from client: ${message}`);
        const data = JSON.parse(message);

        // Add server timestamp and send back
        const response = JSON.stringify({
            text: data.text, 
            sentTime: data.sentTime, 
            receivedTime: Date.now() // Server's timestamp
        });

        ws.send(response);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
