const yargs = require('yargs');
const pickby = require('lodash.pickby');

const options = yargs
  .options({
	c: {
		alias: 'country',
		describe: '国家配置',
		type: 'string',
	},

	m: {
		alias: 'modules',
		describe: '国家下对应的模块，如main,bingo 多个模块请写多次，如-m=bingo -m=main',
		type: 'string',
	},
	w: {
		alias: 'watch',
		describe: '监控',
		type: 'boolean'
	},
	h: {
		alias: 'hot',
		describe: '热个更新',
		type: 'boolean'
	}
})
  .help('help')
  .argv;
const optionKeys = ['country', 'modules', 'watch', 'hot'];
const finaOptions = pickby(
	options,
	(value, key) => value !== undefined && optionKeys.indexOf(key) !== -1);
const detailOptions = () => {
	const env = process.env.NODE_ENV;
	// 默认国家是ke
	if (!finaOptions.country) {
		finaOptions.country = 'ke';
	}
	// 同时职能编译一个国家的代码，所以默认取最后一个国家
	if (Array.isArray(finaOptions.country)) {
		finaOptions.country = finaOptions.country[finaOptions.country.length - 1];
	}
	// 如果没有modules参数表示所有模块都要编译
	if (finaOptions.modules) {
		if (typeof finaOptions.modules === 'string') {
			finaOptions.modules = [finaOptions.modules];
		}
		// 同一个模块职能编译一次，过滤掉重复的
		finaOptions.modules = Array.from(new Set(finaOptions.modules));
	}
	finaOptions.production = env === 'production';
};

detailOptions();
const miaowLibPath = '../compile/lib/miaow.js';

// 取对应国家下的config
try {
	const getConfig = require(`./country/${finaOptions.country}/${finaOptions.production ? 'product.js' : 'local.js'}`); // eslint-disable-line
	let config = getConfig(finaOptions.modules);
	if (!Array.isArray(config) || !config.length) {
		throw new Error(`获取${finaOptions.country}国家下的编译文件出错`);
	}
	config = config.map(cur => Object.assign(cur, {
		production: finaOptions.production,
		watch: finaOptions.watch
	}));
	// 如果不是热更新的话
	console.log('当前编译国家:' + finaOptions.country); // eslint-disable-line
	if (!finaOptions.hot) {
		require(miaowLibPath)(config) // eslint-disable-line
		.catch(err => {
		// 出错后，需要打印错误，并将退出码改成 1
			console.error(err.stack || err); // eslint-disable-line
			process.on('exit', () => process.exit(1));
		});
	} else {
		require('../compile/lib/dev.js')(config)// eslint-disable-line
		.catch(err => {
			console.error(err.stack || err); // eslint-disable-line
			process.on('exit', () => process.exit(1));
		});
	}
} catch (e) {
	console.error(e); // eslint-disable-line
}

