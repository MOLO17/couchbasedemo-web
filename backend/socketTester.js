const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8081');

ws.addEventListener('message', (message) => console.log(message.data.toString()))