'use strict';

const PORT = process.env.PORT || 5000;
const server = require('http').createServer(handler).listen(PORT);
const url = require('url');
const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });

const API_PREFIX = '/ifttt/v1';
const ACTIONS_PREFIX = API_PREFIX + '/actions'

function handler (req, res) {
	var path = url.parse(req.url).pathname;
	console.log('request path: "' + path + '"'); 

	if (path == '/') {
		res.writeHead(200);
		res.end('Hello, world!');
	// actions
	} else if (ACTIONS_PREFIX && path.substr(0, ACTIONS_PREFIX.length) == ACTIONS_PREFIX) {
		// e.g. "/foo"
		var command = path.substr(ACTIONS_PREFIX.length);
		// e.g. "foo"
		command = command.substr(1)
		console.log('command: "' + command + '"')
		forward(command);
		// TODO: handle error case
		// res.writeHead(500);
		// return res.end('Error loading ' + path);
		res.writeHead(200);
		res.end('acknowledged: "' + command + '"');
	} else {
		res.writeHead(404);
		res.end('File not found');
	}
}

wss.on('connection', (ws) => {
	console.log('Client connected');
	ws.on('close', () => console.log('Client disconnected'));
});

function forward(command) {
	wss.clients.forEach((client) => {
		console.log('forward ' + command + ' to client ' + client);
		client.send(command);
	});
}
