'use strict';

const PORT = process.env.PORT || 5000;
const express = require('express');
const API_PREFIX = '/ifttt/v1';
const ACTIONS_PREFIX = API_PREFIX + '/actions'
const ACTIONS_PATTERN = ACTIONS_PREFIX + '/:action'

function writeReply(res, sts, obj) {
	res.status(sts);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(obj));
}

const server = express()
	.use(express.static('static'))
	.use('/', express.static('/static/index.html'))
	.post(ACTIONS_PATTERN, function (req, res) {
		var action = req.params.action
		wss.clients.forEach((client) => {
			console.log('Forward command "' + action + '" to client: ' + client.id);
			client.send(action);
		});
		writeReply(res, 200, {'data': {}});
		// TODO: propagate errors back and handle error case
		// writeReply(res, 500, {'errors': [{'message': 'Blah!'}] });
	})
	.listen(PORT, () => console.log('Listening on ' + PORT));

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });
const uuid = require('uuid');
wss.on('connection', (ws) => {
	ws.id = uuid.v4();
	console.log('Client connected: ' + ws.id);
	ws.on('close', () => console.log('Client disconnected: ' + ws.id));
});
