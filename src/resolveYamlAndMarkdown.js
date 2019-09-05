const yaml = require('js-yaml');

const MarkdownIt = require('markdown-it')({
	breaks: true
});

const dataSplit = /^-{3}[\s\S]+?-{3}/;

function mdRender(str) {
	return MarkdownIt.render(str);
}

function resolveYamlAndMarkdown(content = '') {
	let fileData = content;

	const hasData = dataSplit.test(fileData);
	// console.log(fileData);
	let articleContent = fileData.trim();

	let metaData = {};
	if (hasData) {
		const cutMetaData = fileData.match(dataSplit[0].replace(/(^---)|(---$)/, ''));
		metaData = yaml.safeLoad(cutMetaData);
		articleContent = articleContent.substring(cutMetaData[0].length).trim();
	}
	const renderMd = mdRender(content);

	return [renderMd, metaData];
}

module.exports = resolveYamlAndMarkdown;
