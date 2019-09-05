const chalk = require('chalk');
const emoji = require('node-emoji');
const pkg = require('../package.json');

function isMe(level) {
	level = Number(level);
	return level === level;
}

class Reporter {
	constructor(level, prefix) {
		this.putLevel(level, isMe(level));
		this.prefix = prefix + ' ';
	}
	setPrefix(str) {
		this.prefix = str;
		return this;
	}
	putLevel(level, bool) {
		this.level = bool ? level : 0;
	}

	setLevel(level) {
		this.putLevel(level, isMe(level));
	}
	error(...arg) {
		if (this.level < 5) {
			return;
		}
		console.log(chalk.red(this.prefix + arg.join('\n')));
	}
	warn(...arg) {
		if (this.level < 4) {
			return;
		}
		console.log(chalk.blue(this.prefix + arg.join('\n')));
	}
	success(...arg) {
		if (this.level < 3) {
			return;
		}
		console.log(chalk.green(this.prefix + arg.join('\n')));
	}
	debug(...arg) {
		if (this.level < 2) {
			return;
		}
		console.log(chalk.grey(this.prefix + arg.join('\n')));
	}

	info(...arg) {
		if (this.level < 1) {
			return;
		}
		console.log(chalk.yellow(this.prefix + arg.join('\n')));
	}
}

module.exports = new Reporter(5, emoji.emojify(`:star:  ${pkg.name}`));
