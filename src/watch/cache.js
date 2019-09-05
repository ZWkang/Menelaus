const Reporter = require('../reporter');

class WatchCache {
	constructor() {
		this.cache = new Map();
	}
	// 获得资源
	getSource(/** key.key.key */ keyspointer, finnal) {
		const keys = keyspointer.split('.');
		if (keys.length <= 1) {
			return this.cache.get(keys[0]) || null;
		}
		if (this.cache.has(keys[0])) {
			let cacheValue = this.cache.get(keys[0]);
			let index = 1;
			while (index < keys.length) {
				try {
					cacheValue = cacheValue[keys[index++]];
				} catch (e) {
					Reporter.warn(e.message);
					return null;
				}
			}
			return cacheValue;
		}

		return null;
	}
	setSource(key, fileContent) {
		this.cache.set(key, fileContent);
		return this;
	}
}
