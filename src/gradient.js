const gradient = require('gradient-string');

module.exports = (str) => {
	return gradient('yellow', 'cyan')(str);
};
