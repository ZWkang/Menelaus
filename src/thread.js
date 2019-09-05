const EventEmitter = require('events').EventEmitter;
const Progress = require('./progress');

class thread extends EventEmitter {
	constructor(str) {
		super();
		this.progress = new Progress(str);
		this.on('emitTick', this.emitTick);
	}

	emitTick(obj) {
		this.progress.tick(obj);
	}
}

module.exports = thread;
