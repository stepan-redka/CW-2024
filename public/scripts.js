document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const userNameElement = document.getElementById('userName');
    const onlineUsersList = document.getElementById('onlineUsersList');

    if (!userNameElement) {
        console.error('User element not found');
        return;
    }

    const userName = userNameElement.value;

    let ws;

    function connectWebSocket() {
        ws = new WebSocket('ws://localhost:8080', userName);

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'onlineUsers') {
                updateOnlineUsers(data.users);
            } else {
                const message = document.createElement('div');
                message.classList.add('message');
                message.innerHTML = `<span class="timestamp">${data.timestamp}</span> <span class="username">${data.username}</span>: <span class="content">${data.content}</span>`;
                chatMessages.appendChild(message);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setTimeout(connectWebSocket, 1000); // Reconnect after 1 second
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    function updateOnlineUsers(users) {
        onlineUsersList.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = user;
            onlineUsersList.appendChild(userItem);
        });
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