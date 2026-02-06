const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let onlineUsers = new Set();

wss.on('connection', (ws, req) => {
    const userName = req.headers['sec-websocket-protocol']; // Assuming the username is passed in the WebSocket protocol header
    onlineUsers.add(userName);

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
        onlineUsers.delete(userName);
        console.log('Client disconnected');
        broadcastOnlineUsers();
    });

    broadcastOnlineUsers();
});

function broadcastOnlineUsers() {
    const onlineUsersArray = Array.from(onlineUsers);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'onlineUsers',
                users: onlineUsersArray
            }));
        }
    });
}

module.exports = wss;