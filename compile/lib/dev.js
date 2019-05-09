const getCfg = require('./get-configuration');
const webpack = require('webpack');
const Koa = require('koa');
const koaWebpack = require('koa-webpack');
const path = require('path');
const cors = require('kcors');
const merge = require('webpack-merge');
const querystring = require('querystring');
const { getIp, notifyStats, printStats } = require('./utils');

function createWebpackServer(compiler, config, webpackConfigItem = {}) {
	const target = config.target;
	const port = config.port;
	const publicPath = config.publicPath;
	const app = new Koa();
	app.use(cors());
	if (compiler) {
		const devOptions = merge({
			publicPath,
			stats: {
				colors: true,
				children: true,
				modules: false,
				chunks: false,
				chunkModules: false,
				entrypoints: false,
			},
			logLevel: 'warn',
			headers: {
				'cache-control': 'max-age=0',
			},
			writeToDisk(filePath) {
				return /\.ftl$/.test(filePath);
			},
			// writeToDisk: true,
			watchOptions: {
				ignored: /node_modules/,
			}
		}, { stats: webpackConfigItem.stats, watchOptions: webpackConfigItem.watchOptions });
		koaWebpack({ compiler,
			devMiddleware: devOptions,
			hotClient: {
				logLevel: 'warn'
			}})
		.then(middleware => {
			app.use(middleware);
		});
	}
	app.on('error', error => {
		console.error('server error:', error); // eslint-disable-line
	});
	app.listen(port, err => {
		if (!err && compiler) {
			const ip = getIp();
			const url = `http://${ip}:${port}`;
			if (target) {
				console.info(`\r\n start webpack ${target} building server: ${url}`); // eslint-disable-line
			} else {
				console.info(`\r\n start webpack building server: ${url}`); // eslint-disable-line
			}
		}
	});
}
function modifyEntry(webpackConfig, port) {
	let hotMiddleware = require.resolve('webpack-hot-client').split(path.sep);
	hotMiddleware = hotMiddleware.slice(0, -2);
	const hotConfig = `${path.posix.join(hotMiddleware.join(path.sep))}/client?path=http://${getIp()}:${port}/__webpack_hmr&noInfo=false&reload=true&quiet=false`;
	Object.keys(webpackConfig.entry).forEach(name => {
		webpackConfig.entry[name] = [hotConfig].concat(webpackConfig.entry[name]);
	});
}

function readMemFile(compilers = [], fileName) {
	let content = '';
	try {
		for (const compiler of compilers) {
			const publicPath = compiler.options.output.publicPath;
			fileName = fileName.replace(new RegExp(publicPath), ''); // eslint-disable-line
			const name = path.isAbsolute(fileName) ? fileName : path.join(compiler.outputPath, fileName);
			if (compiler.outputFileSystem.existsSync(name)) {
				return compiler.outputFileSystem.readFileSync(name);
			}
		}
	} catch (e) {
		// console.error('read file error', e);
		content = '';
	}
	return content;
}

module.exports = configItems => {
	// 获取到所有配置
	const items = (!Array.isArray(configItems) ? [configItems] : configItems)
	.map(singleOptions => {
		const factory = singleOptions.configurationFactory || (cfg => cfg);
		return factory(getCfg(singleOptions));
	});
	const res = items.map((webpackCfg, index) => new Promise((res, rej) => {
		const serverConfig = {
			hot: webpackCfg.target !== 'node',
			port: 9000 + index,
			target: webpackCfg.target,
			buildPath: webpackCfg.output.path,
			publicPath: webpackCfg.output.publicPath,
		};
		modifyEntry(webpackCfg, serverConfig.port);
		// console.log(webpackCfg);
		const compiler = webpack(webpackCfg);
		createWebpackServer(compiler, serverConfig);
		compiler.hooks.done.tap('webpack-build-done', stats => {
			res(compiler);
			notifyStats(stats);
			printStats(stats);
		});
	}));
	return Promise.all(res)
	.then(res => {
		const read = fileName => readMemFile(res, fileName);
		const center = new Koa();
		center.use(cors());
		center.use(async (ctx, next) => {
			const params = querystring.parse(ctx.querystring);
			const content = read(params.url);
			if (content) {
				ctx.body = content;
				ctx.status = 200;
			} else {
				ctx.body = '';
				ctx.status = 404;
			}
		});
		const port = 8888;
		center.listen(port, err => {
			if (err) {
				console.error(err);// eslint-disable-line
			} else {
				console.info('内存代理服务器启动，端口:', port);// eslint-disable-line
			}
		});
	})
	.catch(e => {
		console.error(e);
	});
};

