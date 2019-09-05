// class TireTree {
// 	constructor({pattern, children, part, iswild}) {
// 		this.pattern = pattern;
// 		this.children = children;
// 		this.part = part;
// 		this.iswild = iswild;
//     }

// }

// class Asset {
// 	constructor({sourcePath, floder, destPath, extname, type, plugins, content}) {
// 		this.sourcePath = sourcePath;
// 		this.floder = floder;
// 		this.destPath = destPath;
// 		this.extname = extname;
// 		this.type = type;
// 		this.plugins = plugins;
// 		this.content = content;
// 	}

// 	handleProgress() {
// 		if (this.plugins[this.extname]) {
// 			this.content = this.plugins[this.extname].reduce((prev, next) => {
// 				return next(prev, this);
// 			}, this.content);
// 		}
// 		return this;
//     }
//     initRouter() {

//     }
// }

const fsE = require('fs-extra');
const recursive = require('recursive-readdir');
const path = require('path');
const Reporter = require('./reporter');

class Router {
	constructor({postPath, destExtName}) {
		this.postPath = postPath;
		this.root = '/Users/zhouwenkang/Desktop/git-lib/Menelaus';
		this.destExtName = destExtName;
	}
	async init() {
		try {
			const allPathPath = await recursive(this.postPath);
			return allPathPath.map((item) => {
				const extName = path.extname(item);
				let destname = this.destExtName;
				if (typeof this.destExtName === 'function') {
					destname = this.destExtName(item);
				}
				return item.replace(this.root, '').replace(extName, destname);
			});
		} catch (e) {
			Reporter.error(e.message);
			return [];
		}
	}
}

(async () => {
	console.log(
		await new Router({
			postPath: process.cwd() + '/post',
			destExtName: '.html'
		}).init()
	);
})();

// module.exports = Router;
