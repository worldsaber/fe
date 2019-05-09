#!/usr/bin/env node

const path = require('path');
const yargs = require('yargs');
const pickby = require('lodash.pickby');
const cp = require('child_process');
const convertOptions = require('./convertOptions');

const options = yargs
  .options({
	w: {
		alias: 'watch',
		describe: '监听文件变化实时编译',
		type: 'boolean',
	},

	c: {
		alias: 'configPath',
		describe: '配置文件路径',
		type: 'string',
	},

	p: {
		alias: 'production',
		describe: '是否是生产环境',
		type: 'boolean',
	},

	publicPath: {
		describe: '输出解析文件的目录',
		type: 'string',
	},
})
  .help('help')
  .argv;

// 获取上下文
if (options._[0]) {
	options.context = path.resolve(process.cwd(), options._[0]);
}

// 获取输出目录
if (options._[1]) {
	options.output = path.resolve(process.cwd(), options._[1]);
}

const optionKeys = ['context', 'output', 'watch', 'configPath', 'production', 'publicPath'];
const finaOptions = pickby(
  options,
  (value, key) => value !== undefined && optionKeys.indexOf(key) !== -1);
// process.env.NODE_ENV = 'production';
const env = process.env.NODE_ENV;
if (env === 'production') {
	finaOptions.production = true;
} else if (env === 'development') {
	finaOptions.production = false;
}
const miaowLibPath = '../lib/miaow.js';

const isMultipleProcesses = false;
// 开始编译
/* eslint-disable import/no-dynamic-require */
const userConfig = convertOptions(finaOptions);
// 如果是单个用户配置文件，或者是production模式则用单进程
if (!Array.isArray(userConfig) || finaOptions.production || !isMultipleProcesses) {
	require(miaowLibPath)(userConfig) // eslint-disable-line
	.catch(err => {
	// 出错后，需要打印错误，并将退出码改成 1
		console.error(err.stack || err);
		process.on('exit', () => process.exit(1));
	});
} else {
	// 根据userConfig的长度开启多条进程
	for (let i = 0; i < userConfig.length; i++) {
		cp.fork('./compile/bin/childCompile', [JSON.stringify(finaOptions), i], {
			cwd: path.resolve(__dirname, '../../'),
		});
	}
}
