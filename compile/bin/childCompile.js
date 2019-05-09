// 子进程编译
const compile = require('../lib/miaow');
const convertOptions = require('./convertOptions');

const argv = process.argv;
const option = JSON.parse(argv[2]);
const userConfig = convertOptions(option);
const index = +argv[3];
const config = userConfig[index];
compile(config) // eslint-disable-line
.catch(err => {
	// 出错后，需要打印错误，并将退出码改成 1
	console.error(err.stack || err);
	process.on('exit', () => process.exit(1));
});
// 正常退出
process.on('SIGINT', () => process.exit(0));
