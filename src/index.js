const fs = require('fs');
const path = require('path');
const fsE = require('fs-extra');
const recursive = require('recursive-readdir');
const updateNotifier = require('update-notifier');

const home = require('./home');

// ws server
const wss = require('./wsServer');

// 上下文
const Context = require('./context');

// reporter
const Reporter = require('./reporter');

// 进度条
const Progress = require('./progress');

// 亮色字体
const gradient = require('./gradient');

// package.json
const pkg = require('../package.json');

// 根据当前文章目录生成路由
const router = require('./generatorRouter');

// 静态服务器相关
const linecitats = require('linecitats/lib/server');
const koa = require('koa');

// 处理handlebar
const handlebartemplate = require('./handlebartemplate');

// 处理md文件
const resolveYamlAndMarkdown = require('./resolveYamlAndMarkdown');





updateNotifier({
	pkg
}).notify();

// const defaultOpts = {
// 	dest: '/Users/zhouwenkang/Desktop/git-lib/Menelaus/dist',
// 	src: '/Users/zhouwenkang/Desktop/git-lib/Menelaus',
// 	configJSON: '/Users/zhouwenkang/Desktop/git-lib/Menelaus/config.json',
// 	postFloder: 'post',
// 	type: [],
// 	themePath: 'source',
// 	postTemplate: 'post.html'
// };

function Menelaus({
	globalContext,
	workDirectory,
	postFloder,
	destFloder,
	themeFloder,
	postTemplateFilename,
	watch
}) {
	this.context = new Context(globalContext);
	this.workDirectory = workDirectory;
	this.postFloder = postFloder;
	this.destFloder = destFloder;
	this.themeFloder = themeFloder;
	this.postTemplateFilename = postTemplateFilename;

	this.destFullPath = path.join(this.workDirectory, this.destFloder);
	this.postFullPath = path.join(this.workDirectory, this.postFloder);
	this.themeFullPath = path.join(this.workDirectory, this.themeFloder);
	this.postTemplateFullPath = path.join(
		this.workDirectory,
		this.themeFloder,
		this.postTemplateFilename
	);
	(async () => {
		await fsE.ensureDir(this.destFullPath);
		await fsE.ensureDir(this.postFullPath);
		await fsE.ensureDir(this.themeFullPath);
		if(watch) {
			this.wsServer = new wss(8888)
			await this.bundle();
		}
	})();
}

async function getAllFileFromFloder(floderPath, ignore = []) {
	try {
		const result = await recursive(floderPath, ignore);
		return result;
	} catch (e) {
		Reporter.error(e.message);
		return null;
	}
}

Menelaus.prototype.bundle = async function() {
	const allPosts = (await getAllFileFromFloder(this.postFullPath)) || [];
	const allThemes = (await getAllFileFromFloder(this.themeFullPath)) || [];

	const allProgressPath = allPosts.concat(allThemes);

	const bundleInstanceProgress = new Progress('Menelaus [ :bar ] :current/:total :filename', {
		total: allProgressPath.length,
		callback: () => {
			Reporter.success('all progress done,');
		}
	}).init();

	for (let index = 0; index < allProgressPath.length; index++) {
		const inProgressPath = allProgressPath[index];
		const extName = path.extname(inProgressPath);

		if (inProgressPath === this.postTemplateFullPath) {
		} else if (extName === '.html') {
			await this.handleHtmlSource(inProgressPath);
		} else if (extName === '.md') {
			await this.handlePostTemplate(inProgressPath);
		} else {
			await this.handleStaticSource(inProgressPath);
		}
		bundleInstanceProgress.tick({
			filename: inProgressPath
		});
	}
	return 
};

const spinner = require('./spinner');
Menelaus.prototype.handleOneFileProgress = async function(inProgressPath) {
	const extName = path.extname(inProgressPath);
	if (inProgressPath === this.postTemplateFullPath) {
		const allPosts = await getAllFileFromFloder(this.postFullPath);
		for (let post of allPosts) {
			await this.handleOneFileProgress(post);
		}
		return;
	}

	spinner.start(gradient(`start with ${inProgressPath}`));

	if (extName === '.html') {
		await this.handleHtmlSource(inProgressPath);
	} else if (extName === '.md') {
		await this.handlePostTemplate(inProgressPath);
	} else {
		await this.handleStaticSource(inProgressPath);
	}
	spinner.succeed(gradient(`succeed with ${inProgressPath}`));
};

Menelaus.prototype.clean = async function(filePath) {
	if (filePath) {
		return await fsE.rmdir(filePath);
	}
	if (await fsE.remove(this.destFullPath)) {
		return await fsE.rmdir(this.destFullPath);
	}
};

Menelaus.prototype.handleGetFile = async function(filePath, key) {
	let fileContent;
	// if (key) {
	// 	key = Symbol.for(key);
	// 	fileContent = await fsE.readFile(filePath);
	// 	this[key] = fileContent.toString('utf-8');
	// 	return this[key];
	// }
	fileContent = await fsE.readFile(filePath);
	return fileContent.toString('utf-8');
};



//
Menelaus.prototype.handlePostTemplate = async function(postPath) {
	const {postTemplateFullPath} = this;

	// should be path
	const postTemplateContent =
		this[Symbol.for('post')] || (await this.handleGetFile(postTemplateFullPath));
	const mdContent = await fsE.readFile(postPath);
	const [mdRendered, metaData] = resolveYamlAndMarkdown(mdContent.toString('utf-8'));
	const context = {content: mdRendered, ...metaData};
	let postItemData = handlebartemplate(postTemplateContent, this.context.subContext(context));
	const destPathObj = path.parse(postPath);
	const postDest = destPathObj.dir.replace(this.workDirectory, this.destFullPath);

	const postDir = path.dirname(path.join(postDest, destPathObj.base.replace('.md', '.html')));
	postItemData = handleInjectListener(postItemData);
	await fsE.ensureDir(postDir);
	await fsE.writeFile(path.join(postDest, destPathObj.base.replace('.md', '.html')), postItemData);
	return;
};
// 处理html资源
// 走一下渲染模版
Menelaus.prototype.handleHtmlSource = async function(filePath) {
	const testPath = filePath.replace(this.themeFloder, this.destFloder);
	await fsE.ensureDir(path.dirname(testPath));
	if (path.extname(filePath) === '.html') {
		const htmlFile = await fsE.readFile(filePath);
		const context = {content: htmlFile.toString('utf-8'), path: __dirname};
		let postItemData = handlebartemplate(
			htmlFile.toString('utf-8'),
			this.context.subContext(context)
		);
		postItemData = handleInjectListener(postItemData);
		await fsE.writeFile(testPath, postItemData);
	}
};

// 处理静态资源
// 默认静态资源单纯copy
Menelaus.prototype.handleStaticSource = async function(filePath) {
	const filePathDir = path.dirname(filePath);
	const fileDestPath = filePath.replace(this.themeFullPath, this.destFullPath);
	await fsE.ensureDir(filePathDir);
	await fsE.copy(filePath, fileDestPath);
};

const Watcher = require('./watch');
Menelaus.prototype.watch = async function() {
	new Watcher([this.themeFullPath, this.postFullPath], {}).listen(
		async (filePath) => {
			await this.handleOneFileProgress(filePath);
			this.wsServer.emitmessage();
		},
		async (filepath) => {
			await this.clean();
			await this.bundle();
			this.wsServer.emitmessage();
		},
		(e) => {
			console.log(e.message);
		}
	);
};



Menelaus.prototype.startStaticServer = function(config) {
	const app = new koa();
	const ll = new linecitats({
		...config,
		dir: this.destFloder
	});
	console.log(this.destFullPath)
	// app.use(async (ctx, next) => {
	// 	ctx.body = {
	// 		aaa: 'true'
	// 	}
	// })
	app.use(ll.middleware());
	app.listen(8000, () => {
		console.log('aaa');
	});
};

Menelaus.loadFileToString = function(str) {
	const fileFullPath = path.join(process.cwd(), str);
	const hasFile = fsE.existsSync(fileFullPath);
	const isFile = !fs.statSync(fileFullPath).isDirectory();

	if (hasFile && isFile) {
		if (~['json', 'js'].indexOf(path.extname(fileFullPath))) {
			return fsE.readFileSync(fileFullPath).toString('utf-8');
		} else {
			return require(fileFullPath);
		}
	}
	return '';
};

function handleInjectListener(content) {
	const listenString = `
	<script>
    const ws = new WebSocket('ws://127.0.0.1:8888')
    ws.onmessage = function(data) {
        let parseData
        try {
            parseData = JSON.parse(data.data)
        }catch(e) {
            throw e;
        }
        if(parseData.type === 'reload') {
			location.reload()
			return
        }
    }
	</script>
	
	`;
	content = content.replace(/(<\/body>)/, listenString + '<\/body>');
	return content;
}


Menelaus.cli = require('commander');

module.exports = Menelaus;
