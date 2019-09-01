const chalk = require('chalk');

function isMe(level) {
	level = Number(level);
	return level === level;
}

class Reporter {
	constructor(level) {
		this.putLevel(level, isMe(level));
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
		console.log(chalk.red(arg.join('\n')));
	}
	warn(...arg) {
		if (this.level < 4) {
			return;
		}
		console.log(chalk.blue(arg.join('\n')));
	}
	success(...arg) {
		if (this.level < 3) {
			return;
		}
		console.log(chalk.green(arg.join('\n')));
	}
	debug(...arg) {
		if (this.level < 2) {
			return;
		}
		console.log(chalk.grey(arg.join('\n')));
	}

	info(...arg) {
		if (this.level < 1) {
			return;
		}
		console.log(chalk.yellow(arg.join('\n')));
	}
}

module.exports = new Reporter(5);
