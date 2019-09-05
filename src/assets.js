class Asset {
	constructor() {
		this.handlers = {};
	}

	registerExtend(extname, handler) {
		if (extname.startsWith('.')) {
			extname = '.' + extname;
		}
		if (!this.handlers[extname]) {
			this.handlers[extname] = [];
		}
		this.handlers[extname].push(handler);
		return this;
	}
	getExtend(extname) {
		return this.handlers[extname] || [];
	}
}

module.exports = Asset;
