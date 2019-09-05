const ProgressBar = require('progress');

let id = 0;
class Progress {
	constructor(str, opts) {
		this.id = id++;
		this.progressContent = str;
		this.instance = null;
		this.options = opts;
		// this.callback = opts.callback;
	}
	init() {
		this.instance = new ProgressBar(this.progressContent, this.options);
		return this;
	}
	tick(obj) {
		if (!this.instance || this.instance.complete) {
			return;
		}
		if (obj) {
			this.instance && this.instance.tick(obj);
		} else {
			this.instance && this.instance.tick();
		}
		return;
	}
}

module.exports = Progress;
