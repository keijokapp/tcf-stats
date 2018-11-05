let cleanupHandler = null;
const sigintHandler = signalHandler.bind(this, 'SIGINT');
const sighupHandler = signalHandler.bind(this, 'SIGHUP');
const sigquitHandler = signalHandler.bind(this, 'SIGQUIT');
const sigtermHandler = signalHandler.bind(this, 'SIGTERM');

function signalHandler(signal) {
	uninstall();
	cleanupHandler(signal, () => {
		process.kill(process.pid, signal);
	});
	return false;
}

function exitHandler(code) {
	uninstall();
	cleanupHandler(code);
}

function install() {
	process.on('SIGINT', sigintHandler);
	process.on('SIGHUP', sighupHandler);
	process.on('SIGQUIT', sigquitHandler);
	process.on('SIGTERM', sigtermHandler);
	process.on('exit', exitHandler);
}

function uninstall() {
	process.removeListener('SIGINT', sigintHandler);
	process.removeListener('SIGHUP', sighupHandler);
	process.removeListener('SIGQUIT', sigquitHandler);
	process.removeListener('SIGTERM', sigtermHandler);
	process.removeListener('exit', exitHandler);
}

export default function(callback) {
	if(typeof callback === 'function') {
		if(cleanupHandler) {
			throw new Error('Cleanup handler has already been set');
		}
		cleanupHandler = callback;
		install();
	} else if(Number.isInteger(callback) && callback >= 0 && callback <= 255) {
		uninstall();
		if(cleanupHandler) {
			cleanupHandler(callback, () => {
				process.exit(callback);
			});
		} else {
			process.exit(callback);
		}
	} else {
		throw new Error('Bad exit code: ' + callback);
	}
}
