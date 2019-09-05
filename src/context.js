class Context {
	constructor(globalContext) {
		this.globalContext = globalContext;
		this.sub = new Map();
	}
	addGlobal(context) {
		this.globalContext = Object.assign(this.globalContext, context);
		return this;
	}
	subContext(key, inject) {
		if (inject !== void 666) {
			this.sub.set(key, Object.assign(this.globalContext, inject));
		}
		inject = key;
		return Object.assign(this.globalContext, inject);
	}
}

module.exports = Context;
