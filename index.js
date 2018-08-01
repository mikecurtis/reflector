'use strict';

const PORT = process.env.PORT || 5000;
const express = require('express');
const API_PREFIX = '/ifttt/v1';
const ACTIONS_PREFIX = API_PREFIX + '/actions'
const ACTIONS_PATTERN = ACTIONS_PREFIX + '/:action'

const server = express()
	.use(express.static('static'))
	.use('/', express.static('/static/index.html'))
	.post(ACTIONS_PATTERN, function (req, res) {
		var action = req.params.action
		console.log(action)
		wss.clients.forEach((client) => {
			console.log('forward ' + action + ' to client ' + client);
			client.send(action);
		});
		// TODO: propagate errors back and handle error case
		// res.writeHead(500);
		// return res.end('Error loading ' + path);
		res.writeHead(200);
		res.end('acknowledged: "' + action + '"');
	})
	.listen(PORT, () => console.log('Listening on ' + PORT));

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
	console.log('Client connected');
	ws.on('close', () => console.log('Client disconnected'));
});
