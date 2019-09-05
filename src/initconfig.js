const path = require('path');
const fse = require('fs-extra');

async function initconfig() {
	const cwd = process.cwd();
	const configJSPath = path.join(cwd, 'config.js');

	let initData = {};
	const hasPrevConfigFile = await fse.exists(configJSPath);

	if (hasPrevConfigFile) {
		initData = require(configJSPath);
	}

	let {
		globalContext,
		postFloder,
		workDirectory,
		destFloder,
		themeFloder,
		postTemplateFilename
	} = initData;

	if (!workDirectory) {
		workDirectory = cwd;
	}
	if (!destFloder) {
		destFloder = 'dist';
	}
	if (!themeFloder) {
		themeFloder = 'source';
	}
	if (!postTemplateFilename) {
		postTemplateFilename = 'post.html';
	}
	if (!postFloder) {
		postFloder = 'post';
	}
	if (!globalContext) {
		globalContext = {};
	}
	// console.log(initData);
	initData = Object.assign(initData, {
		workDirectory,
		destFloder,
		themeFloder,
		postTemplateFilename,
		postFloder,
		globalContext
	});

	await fse.writeFile(configJSPath, `module.exports=${JSON.stringify(initData)}`);
}

module.exports = initconfig;
