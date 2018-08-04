'use strict';

const PORT = process.env.PORT || 5000;
const DEBUG = process.env.DEBUG || false;
const express = require('express');
const API_PREFIX = '/ifttt/v1';

function writeReply(res, sts, obj) {
	res.status(sts);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(obj));
}

const server = express()
	.use(express.static('static'))
	.use('/', express.static('/static/index.html'))
	// Status request.
	.get(API_PREFIX + '/status', function (req, res) {
		writeReply(res, 200, {});
	})
	// Action request.
	.post(API_PREFIX + '/actions/:action', function (req, res) {
		if (DEBUG) {
			console.log(req);
		}
		var action = req.params.action
		wss.clients.forEach((client) => {
			console.log('Forward command "' + action + '" to client: ' + client.id);
			client.send(action);
		});
		// TODO: propagate errors back and return.
		// writeReply(res, 500, {'errors': [{'message': 'Blah!'}] });
		writeReply(res, 200, {'data': {}});
	})
	// Test setup request.
	.post(API_PREFIX + '/test/setup', function (req, res) {
		writeReply(res, 200, {'data': {'samples': {'actions': {'test_command': {}}}}});
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
