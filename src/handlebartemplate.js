const handlebars = require('handlebars');
const fse = require('fs-extra');
const path = require('fs-extra');

// handlebars.registerPartial('myPartial', function() {
// 	console.log(childContent);
// 	return childContent;
// });
handlebars.registerPartial('myPartial', '{{content}}');

function handlebartemplate(content, data) {
	// handlebars.registerPartial('myPartial', function() {
	// 	let childContent = fse
	// 		.readFileSync('/Users/zhouwenkang/Desktop/git-lib/Menelaus' + '/source' + '/' + 'about.html')
	// 		.toString('utf-8');
	// 	return childContent;
	// });
	// console.log(data);
	const parseTemplate = handlebars.compile(content);
	// handlebars.registerHelper('includes', function(path, data) {
	// 	let childContent = fse
	// 		.readFileSync('/Users/zhouwenkang/Desktop/git-lib/Menelaus' + '/source' + '/' + path)
	// 		.toString('utf-8');
	// 	return handlebars.compile(childContent)(data);
	// });
	// console.log(content, data);
	return parseTemplate(data);
}

function registerSubTemplate(key, opts) {
	const {themeFloder = path.join(process.cwd(), 'source', key)} = opts;
	let childContent = fse
		.readFileSync('/Users/zhouwenkang/Desktop/git-lib/Menelaus' + '/source' + '/' + 'about.html')
		.toString('utf-8');

	handlebars.registerPartial(key, childContent);
}

module.exports = handlebartemplate;
