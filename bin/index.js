#!/usr/bin/env node

const commander = require('commander');
const Menelaus = require('../src/index');
const initConfig = require('../src/initconfig');

// const cliPlugins = Menelaus.loadFileToString('config.js').cliPlugins || []

// for(cliPlugins)
// cliPlugins.forEach((cliplugin) => {
// 	let plugin = cliplugin;
// 	if(typeof cliplugin === 'string') plugin = require(cliplugin)

// 	if (typeof plugin.CLI === 'function') {
//         plugin.CLI(Menelaus)
//       } else if (Array.isArray(plugin)) {
//         const options = plugin[1]
//         plugin = typeof plugin[0] === 'string'
//           ? require(plugin[0])
//           : plugin[0]

//         plugin.CLI(Menelaus, options)
//       }
// })

commander.command('build', '').action(async () => {
	const config = await Menelaus.loadFileToString('config.js');
	await new Menelaus(config).bundle();
});

commander.command('watch', '').action(async () => {
	const config = await Menelaus.loadFileToString('config.js');

	await new Menelaus({...config, watch: true}).watch();
});

commander.command('server', '').action(async () => {
	const config = await Menelaus.loadFileToString('config.js');

	await new Menelaus({...config}).startStaticServer({cache: false});
})

commander.command('initconfig', '').action(async () => {
	console.log('init work');
	await initConfig();
});

commander.parse(process.argv);
