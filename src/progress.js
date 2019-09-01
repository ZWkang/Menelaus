var ProgressBar = require('progress');

// var bar = new ProgressBar(':bar', {total: 10});
// var timer = setInterval(function() {
// 	bar.tick();
// 	if (bar.complete) {
// 		console.log('\ncomplete\n');
// 		clearInterval(timer);
// 	}
// }, 100);

// var bar = new ProgressBar(':current: :token1 :token2', {total: 3});
// bar.tick({
// 	token1: 'Hello',
// 	token2: 'World!\n'
// });
// bar.tick(2, {
// 	token1: 'Goodbye',
// 	token2: 'World!'
// });

// var bar = new ProgressBar(':bar :current/:total', {total: 10});
// var timer = setInterval(function() {
// 	bar.tick();
// 	if (bar.complete) {
// 		clearInterval(timer);
// 	} else if (bar.curr === 5) {
// 		bar.interrupt(
// 			'this message appears above the progress bar\ncurrent progress is ' +
// 				bar.curr +
// 				'/' +
// 				bar.total
// 		);
// 	}
// }, 1000);

let id = 0;
class Progress {
	constructor(str, opts) {
		this.id = id++;
		this.progressContent = str;
		this.instance = null;
		this.options = opts;
		// this.callback = opts.callback;
	}
	init() {
		this.instance = new ProgressBar(this.progressContent, this.options);
		return this;
	}
	tick(obj) {
		if (!this.instance || this.instance.complete) {
			return;
		}
		if (obj) {
			this.instance && this.instance.tick(obj);
		} else {
			this.instance && this.instance.tick();
		}
		return;
	}
}

const instance = new Progress('Hello world! :tests :bar :current/:total :filename', {
	total: 10,
	callback: () => {
		clearInterval(clearMe);
	}
}).init();

const gg = require('./gradient');
// console.log();
setInterval(() => instance.tick({filename: gg('index.md' + id++)}), 1000);
