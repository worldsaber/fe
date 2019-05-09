const path = require('path');

const { getChunkName } = require('./utils');
const { HASH_LENGTH } = require('./constants');
const getLoaders = require('./get-loaders');
const getPlugins = require('./get-plugins');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 当前进程的路径
const processCWD = process.cwd();

// 默认选项
const DEFAULT_OPTIONS = {
	watch: false,
	context: processCWD,
	output: path.resolve(processCWD, 'build'),
	publicPath: '/',
	commons: [],
	entries: [],
	syncFiles: [],
	define: {},
	production: false,
	cssModules: true,
};

// 获取 webpack 的配置信息
const getConfiguration = _options => {
	const options = Object.assign({}, DEFAULT_OPTIONS, _options);
	const {
    context,
    entries,
    commons,
	watch,
	// 是否mock假数据
	// isMock,
	// 当前环境
	env,
    output,
    publicPath,
    production,
    filename,
	define
  } = options;
	// define 替换信息
	options.define = Object.assign({
		// CDN 变量
		__cdn__: JSON.stringify(publicPath),
		// 调试变量
		__debug__: (!production).toString(),
    // 设置 process.env.NODE_ENV 变量，可以让 vue 等库进入生产模式
		'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
	}, define);

  // 通过 entries 获取 entry
	const entry = {};
	entries.forEach(entryItem => {
		const script = typeof entryItem === 'string' ? entryItem : entryItem.script;

		if (script) {
			entry[getChunkName(script)] = script;
		}

		if (entryItem.template) {
			entry[getChunkName(entryItem.template)] = entryItem.template;
		}
	});

	//   将 commons 里的公共组件添加到 entry 中
	// 为什么呢，因为有些公共库文件偷懒，并没有引入，所以这里必须加入口，然后由plugin自动引入
	// 注意公共模块，先加载优先级最高，内部加载文件如果多个公共文件有重复的会默认打包到优先级高的那个里面
	commons.forEach(commonScript => {
		entry[getChunkName(commonScript)] = commonScript;
	});
	const developmentFilename = '[name].js';
	const productionFilename = '[name].[chunkhash].js';
	const defaultFilename = production ? productionFilename : developmentFilename;
	const developmentChunkFilename = '[name].js';
	const productionChunkFilename = '[name].[chunkhash].js';
	const chunkFilename = production ? productionChunkFilename : developmentChunkFilename;
	const maxPriority = commons.length;
	const cacheGroups = Object.assign({
		'default': false,
	}, commons.reduce((all, current, index) => {
		const name = getChunkName(current);
		all[name] = {
			name,
			test: new RegExp(name),
			reuseExistingChunk: true,
			enforce: true,
			// 优先级问题，多个cacheGroup在文件中的优先级
			priority: maxPriority - index
		};
		return all;
	}, {}));
	const configuration = {
		watch,
		cache: true,
		watchOptions: {
			ignored: /node_modules/, // 忽略不用监听变更的目录
			aggregateTimeout: 600, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
			poll: 1000 // 每秒询问的文件变更的次数
		},
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					sourceMap: true,
					uglifyOptions: {
						output: {
							beautify: false, // 不需要格式化
							comments(node, comment) {
								return comment.type === 'comment2' && comment.value.charAt(0) === '!';
							},
						},
						compress: {
							warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
							drop_console: false, // 删除所有的 `console` 语句，可以兼容ie浏览器
							collapse_vars: true, // 内嵌定义了但是只用到一次的变量
							reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
						}
					}
				})
			],
			// runtimeChunk: {
			// 	name: `${env === 'wap' ? 'mobile' : 'desktop'}/manifest`
			// },
			splitChunks: {
				// 最小的大小
				minSize: 1,
				// 最小共享块数,即至少需要多少个模块引入，才自动抽出成公共模块
				minChunks: 4,
				// 按需加载请求数量
				maxAsyncRequests: 10,
				// 入口最大并行请求数目
				maxInitialRequests: 10,
				chunks: 'initial',
				// 自动区分目录直接用fileName即可
				filename: production ? productionFilename : developmentFilename,
				cacheGroups
			},
			occurrenceOrder: true
		},
		performance: {
			maxAssetSize: 2000000,
			maxEntrypointSize: 2000000
		},
		context,
		entry,
		output: {
			path: output,
			publicPath,
			chunkFilename,
			filename: filename || defaultFilename,
			pathinfo: !production,
			hashDigestLength: HASH_LENGTH,
		},
		mode: production ? 'production' : 'development',
		devtool: production ? 'nosources-source-map' : 'cheap-module-source-map',
		module: {
			rules: getLoaders(options),
		},
		resolveLoader: {
			modules: [
				path.resolve(__dirname, 'loaders'),
				'node_modules',
			],
		},
		resolve: {
			modules: ['common', 'common-pc', 'common-wap', 'node_modules'],
			extensions: ['.js', '.es6', '.json', '.vue', '.jsx'],
			alias: {
				vue: 'vue/dist/vue.esm.js'
			}
		},
		plugins: getPlugins(options),
	};

	return configuration;
};

module.exports = getConfiguration;
