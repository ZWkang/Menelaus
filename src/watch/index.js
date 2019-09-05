const chokidar = require('chokidar');

// chokidar.watch('').on('change', (...arg) => {
// 	console.log(arg);
// });
// const watcher = chokidar.watch('/Users/zhouwenkang/Desktop/git-lib/Menelaus', {
// 	cwd: '/Users/zhouwenkang/Desktop/git-lib/Menelaus'
// });

class Watcher {
	constructor(path, opts) {
		// console.log(path);
		this.watcher = chokidar.watch(path, opts);
		// this.watcher.on('ready', () => {
		// 	this.watcher
		// 		.on('add', (...args) => {
		// 			console.log(args);
		// 		})
		// 		.on('change', (...args) => {
		// 			console.log(args);
		// 		})
		// 		.on('unlink', (...args) => {
		// 			console.log(args);
		// 		})
		// 		.on('unlinkDir', (...args) => {
		// 			console.log(args);
		// 		})
		// 		.on('error', (error) => {
		// 			console.log(`Watcher error: ${error}`);
		// 		});
		// });
	}
	listen(callback = () => {}, unlinkCallback, onerror = () => {}) {
		this.watcher.on('ready', () => {
			this.watcher
				.on('add', callback)
				.on('change', callback)
				.on('unlink', unlinkCallback)
				.on('unlinkDir', unlinkCallback)
				.on('error', onerror);
		});
	}
	unlisten() {
		this.watcher.close();
		this.watcher = null;
	}
}

module.exports = Watcher;

// new Watcher('../../source', {}).listen(() => {
// 	console.log('1111');
// });
