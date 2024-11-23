const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`Received message: ${message}`);
        // Broadcast the message to all clients, including the sender
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    username: data.username,
                    content: data.content,
                    timestamp: new Date().toLocaleString()
                }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = wss;