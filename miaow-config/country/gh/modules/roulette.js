const path = require('path');
const entries = require('../../../entries/roulette')();

const glob = require('glob');

// 将所有的html和htm文件加入编译
// 只编译了图片的引用
function compileHtml (entry, env) {
	let some;
	if (env === 'pc') {
		some = './desktop/**/*.+(html|htm)';
	} else {
		some = './mobile/**/*.+(html|htm)';
	}
	const files = glob.sync(some, {
		cwd: path.resolve(__dirname, 'src')
	});
	files.forEach(file => {
		const f = file.replace(/^\.\//, '');
		entry[f] = './' + f;
	});
}

function configurationFactory (configuration, env) {
	compileHtml(configuration.entry, env);
	return configuration;
}

const mobileConfig = {
	entries: entries.wap,
	cssModules: false,
	commons: [
		'./modules/common-wap/lib/base-lib.js', './modules/common-wap/lib/index.js',
		'./modules/common-wap/appCore/index.js',
		'./modules/common-wap/base/base.js',
		'./modules/common-wap/lib/betslip.js',
		'./modules/common-wap/core/core.js'
	],
	context: path.resolve('./src'),
	module: 'roulette',
	env: 'wap',
	configurationFactory (config) {
		return configurationFactory.call(this, config, 'wap');
	}
};

module.exports = function (publicPath, isMock, define) {
	return [
		Object.assign(mobileConfig, { publicPath, isMock, define })
	];
};
