require('dotenv').config();

const WebSocket = require('ws');
const request = require('request-promise-native');

const {
  env: {
    SYNC_GATEWAY_WEBSOCKET = '',
    WS_PORT = 8081,
    SYNC_GATEWAY_DB_INFO_URL = ''
  },
} = process;


const socketServer = new WebSocket.Server({
  port: WS_PORT,
});

socketServer.on('connection', (socket) => {
  console.info('Client connected');
  socket.on("disconnect", () => {
    console.info('Client disconnected');
  });
});

const syncGatewayWS = new WebSocket(SYNC_GATEWAY_WEBSOCKET);
syncGatewayWS.on('open', () => {
  console.info('SyncGateway WebSocket Opened');
  request.get(SYNC_GATEWAY_DB_INFO_URL).then((res) => {
    try {
      const { update_seq = 0 } = JSON.parse(res);
      var openString = JSON.stringify({ since: update_seq, include_docs: true });
      syncGatewayWS.send(openString);
    } catch {
      console.error('Failed to parse JSON');
    }
  })
})

syncGatewayWS.addEventListener('error', console.error);

syncGatewayWS.addEventListener('message', function (event) {
  if (event.data) {
    const parsedData = JSON.parse(event.data);
    
    const result = parsedData.map((data) => {
      const { doc: document = {} } = data;
      const {
        _deleted: deleted = false,
        _id: id,
        email,
        name,
        surname,
        phoneNumber,
      } = document;

      return {
        deleted,
        id,
        contact: {
          id,
          email,
          name,
          surname,
          phoneNumber,
        }
      }
    });

    const dataStringified = JSON.stringify(result);

    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(dataStringified);
      }
    });
  }
});