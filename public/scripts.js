document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const userNameElement = document.getElementById('userName');

    if (!userNameElement) {
        console.error('User element not found');
        return;
    }

    const userName = userNameElement.value;

    let ws;

    function connectWebSocket() {
        ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const message = document.createElement('div');
            message.classList.add('message');
            message.innerHTML = `<span class="timestamp">${data.timestamp}</span> <span class="username">${data.username}</span>: <span class="content">${data.content}</span>`;
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    connectWebSocket();

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const content = chatInput.value;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ username: userName, content }));
            chatInput.value = '';
        } else {
            console.error('WebSocket connection is not open');
        }
    });
});