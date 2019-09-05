(async () => {
	const srcPath = path.join(defaultOpts.src, defaultOpts.themePath);
	const destPath = defaultOpts.dest;
	const postPath = path.join(defaultOpts.src, defaultOpts.postFloder);

	const pathTemplate = path.join(defaultOpts.src, defaultOpts.themePath, defaultOpts.postTemplate);

	const posts = await getAllFileFromFloder(postPath);
	const data = await getAllFileFromFloder(srcPath);

	const AllProgressFiles = posts.concat(data);
	// console.log(AllProgressFiles);

	const postTemplateData = await fsE.readFile(pathTemplate);

	const instance = new Progress('Hello world! :bar :current/:total :filename', {
		total: AllProgressFiles.length,
		callback: () => {
			console.log('done');
		}
		// renderThrottle: 1000
	}).init();
	// const destFile = console.log(data);

	for (let index = 0; index < AllProgressFiles.length; index++) {
		let item = AllProgressFiles[index];
		// console.log(item);
		// AllProgressFiles.forEach(async (item) => {
		instance.tick({
			filename: gradient(item)
		});
		await delay(200);
		const routes = await new router({
			destExtName: '.html',
			postPath: __dirname + '/../post'
		}).init();
		const subContext = new Context({routes: routes});
		if (path.extname(item) === '.md') {
			try {
				// 处理post数据
				const mdContent = await fsE.readFile(item);
				const [mdRendered, metaData] = resolveYamlAndMarkdown(mdContent.toString('utf-8'));
				const context = {content: mdRendered, ...metaData};
				const postItemData = handlebartemplate(
					postTemplateData.toString('utf-8'),
					subContext.subContext(context)
				);
				const destPathObj = path.parse(item);
				const destDir = destPathObj.dir.replace(defaultOpts.src, destPath);

				await fsE.ensureDir(destDir);
				await fsE.writeFile(
					path.join(
						destPathObj.dir.replace(defaultOpts.src, destPath),
						destPathObj.base.replace('.md', '.html')
					),
					postItemData
				);

				// return;
				continue;
			} catch (e) {
				console.log(e.message);
			}
		}
		if (pathTemplate === item) {
			continue;
			return;
		}
		// 处理静态资源
		const testPath = item.replace(srcPath, destPath);
		await fsE.ensureDir(path.dirname(testPath));

		if (path.extname(item) === '.html') {
			const htmlFile = await fsE.readFile(item);
			const context = {content: htmlFile.toString('utf-8'), path: __dirname};
			const postItemData = handlebartemplate(
				htmlFile.toString('utf-8'),
				subContext.subContext(context)
			);
			// console.log(testPath, postItemData);
			await fsE.writeFile(testPath, postItemData);
			// return;
			continue;
		}
		await fsE.copy(item, testPath);
	}
})();
