#!/usr/bin/node

import { chmodSync, unlinkSync } from 'fs';
import http from 'http';
import cleanup from './cleanup';
import { logger } from './common';
import config from './config';
import app from './app';
import snapshot from './snapshot';


function ready() {
	try {
		require('sd-notify').ready();
	} catch(e) {
		logger.debug('Systemd notification are not available');
	}
	snapshot();
}


const servers = [];

function createServer() {
	const server = http.createServer(app);
	server.on('error', e => {
		logger.error('Server error', { e });
		cleanup(1);
	});
	servers.push(server);
	return server;
}


cleanup((exit, callback) => {
	for(const server of servers) {
		server.close();
	}
	logger.once('finish', callback);
	logger.info('Exiting...', { exit });
	logger.end();
	if(config.listen.path) {
		try {
			unlinkSync(config.listen.path);
		} catch(e) {
			if(e.code !== 'ENOENT') {
				throw e;
			}
		}
	}
});


if(config.listen === 'systemd') {
	const socketCount = parseInt(process.env.LISTEN_FDS, 10);
	if(socketCount < 1) {
		logger.error('Bad number of sockets', { socketCount });
	} else {
		const PipeWrap = process.binding('pipe_wrap');
		const fds = [];
		for(let fd = 3; fd < 3 + socketCount; fd++) {
			const server = createServer();
			if(PipeWrap.constants && typeof PipeWrap.constants.SOCKET !== 'undefined') {
				server._handle = new PipeWrap.Pipe(PipeWrap.constants.SOCKET);
			} else {
				server._handle = new PipeWrap.Pipe();
			}
			server._handle.open(fd);
			server._listen2(null, -1, -1);
			fds.push(fd);
		}
		logger.info('Listening', { fds });
		notifySystemdy();
	}
} else if('port' in config.listen) {
	const server = createServer();
	server.listen(config.listen.port, config.listen.address, () => {
		const address = server.address();
		logger.info('Listening', address);
		ready();
	});
} else if('path' in config.listen) {
	const server = createServer();
	server.listen(config.listen.path, () => {
		let error = false;
		if('mode' in config.listen) {
			try {
				chmodSync(config.listen.path, config.listen.mode);
			} catch(e) {
				error = true;
				logger.error(e.code === 'ERR_INVALID_ARG_VALUE' ? 'Bad socket mode' : 'Failed to set socket mode', {
					path: config.listen.path,
					mode: config.listen.mode
				});
				server.close();
			}
		}
		if(!error) {
			logger.info('Listening', { path: config.listen.path });
			ready();
		} else {
			cleanup();
		}
	});
}
