const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// sw服务的编译的 代码
const syncBases = ['**/*.txt', '**/*.ftl.js', 'logo/**/*.png', 'logo/**/*.ico', 'sw-toolbox.js', 'third-lib/**/*.js', 'third-lib/**/*.css', 'sitemap_sportybet.xml'];
const swConfig = {
	entries: [{
		script: './sw.js',
	}, {
		script: './manifest.json'
	}, {
		script: './globalConfig.ftl'
	}],
	context: path.resolve('./src'),
	configurationFactory (config) {
		config.output.filename = '[name].js';
		config.output.libraryTarget = 'this';
		// 不进行拆包
		config.optimization = {};
		config.plugins.push(
			new CopyWebpackPlugin(syncBases.map(syncFile => ({ from: syncFile, to: '[path][name].[ext]' }))),
			// 将appcore拷贝出来给第三方使用
			new CopyWebpackPlugin([{
				from: '../src/common/packages/es.appcore/sportybet.min.js',
				to: 'appcore.js'
			}])
		);
		return config;
	}
};

module.exports = function (publicPath, isMock, define) {
	return Object.assign(swConfig, { define });
};
