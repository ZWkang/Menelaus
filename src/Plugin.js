const path = require('path');

const fse = require('fs-extra');

class Plugin {
	constructor(plugin = []) {
		// super(plugin);
		this.plugins = [this.readConfig, ...plugin];
	}
	registerPlugin(plugin) {
		this.plugins.push(plugin);
		return this;
	}
	async runPlugins(somethings) {
		let result = somethings;
		for (let plugin of this.plugins) {
			result = await plugin(result);
		}
		return result;
	}
	async readConfig(globalContext) {
		const configFilePath = path.join(process.cwd(), 'config.js');
		const isExistsConfigFile = await fse.exists(configFilePath);
		if (isExistsConfigFile) {
			const config = require(configFilePath);
			return Object.assign({}, globalContext, config);
		}
		return globalContext;
	}
}
// (async () => {
// 	console.log(await new Plugin().runPlugins({}));
// })();

module.exports = Plugin;
