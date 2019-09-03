const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');

const Reporter = require('./reporter');

class wsServer extends EventEmitter {
	constructor(port) {
		super();
		if (!wsServer.instance) {
			Reporter.info(` websocket server in ${port} is listen`);
			this.wss = new WebSocket.Server({port});
			this.wss.on('connection', function connection(ws) {
				ws.on('message', function incoming(message) {
					console.log('received: %s', message);
				});
			});
			wsServer.instance = this;
			return this;
		} else {
			return wsServer.instance;
		}
	}
	emitmessage(assetSource) {
		this.wss.clients.forEach((ws) => {
			ws.send(
				JSON.stringify({
					type: 'reload',
					...assetSource
				})
			);
		});
	}
}
wsServer.instance = null;

module.exports = wsServer;
