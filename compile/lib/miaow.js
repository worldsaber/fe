
const webpack = require('webpack');
const { printStats, notifyStats } = require('./utils');

const getConfiguration = require('./get-configuration');

function defaultConfigurationFactory(configuration) {
	return configuration;
}

const compile = options => {
	// 适用于 webpack 的配置信息
	const configurationTasks = (!Array.isArray(options) ? [options] : options)
		.map(singleOptions => {
			const factory = singleOptions.configurationFactory || defaultConfigurationFactory;
			return factory(getConfiguration(singleOptions));
		});

	return Promise
		.all(configurationTasks)
		.then(configurations => new Promise((resolve, reject) => {
			webpack(configurations, (err, stats) => {
				if (err) {
					reject(err);
					return;
				}
				// 打印编译结果
				printStats(stats);

				// 是否正在 watch
				const hasWatch = !!stats.stats.find(item => item.compilation.options.watch);
				if (hasWatch) {
					// 提示编译结果
					notifyStats(stats);
					return;
				}

				if (stats.hasErrors()) {
					reject('编译失败，请解决完错误之后再重试！');
				} else {
					resolve();
				}
			});
		}));
};

module.exports = compile;
