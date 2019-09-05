const terminalLink = require('terminal-link');
const pkg = require('../package.json');
const link = terminalLink(`${pkg.name} HOME`, `https://github.com/${pkg.repository}`);

module.exports = link;
