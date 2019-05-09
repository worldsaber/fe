const { HASH_LENGTH } = require('./constants');
// const threadLoader = require('thread-loader');

// threadLoader.warmup({
//   // pool options, like passed to loader options
//   // must match loader options to boot the correct pool
// }, [
//   // modules to load
//   // can be any module, i. e.
// 	'babel-loader',
// 	'babel-preset-stage-2',
// 	'vue-loader',
// 	'vue-style-loader',
// 	'postcss-loader',
// 	'less-re-loader'
// ]);
// Babel 加载器
// https://babeljs.io/
function getBabelLoader() {
	return {
		loader: 'babel-loader',
		options: {
			cacheDirectory: false,
		},
	};
}

// Vue 加载器
// https://vue-loader.vuejs.org/zh-cn/
function getVueLoader(options) {
	return {
		loader: 'vue-loader',
		options: {
			cacheDirectory: '.cache-loader',
			cacheIdentifier: '~~~',
			transformAssetUrls: {
				video: ['src', 'poster'],
				source: 'src',
				img: 'src',
				image: 'xlink:href'
			}
		},
	};
}

// css-loader
function getCssLoader({ cssModules: modules }) {
	return {
		loader: 'css-loader',
		options: {
			modules,
			localIdentName: `[path][name]__[local]--[hash:base64:${HASH_LENGTH}]`,
		},
	};
}
function getStrReplaceLoader (defineVal) {
	const keys = Object.keys(defineVal);
	const multiple = keys.map(key => ({
		search: key,
		replace: defineVal[key],
		flags: 'g'
	}));
	return {
		loader: 'string-replace-loader',
		options: {
			multiple
		}
	};
}

function getLoaders(options) {
	const {
	production,
	isMock,
  } = options;
	const fileLoaderFilename = production ?
    `[path][name].[hash:${HASH_LENGTH}].[ext]` :
    '[path][name].[ext]';

	const cssFileLoaderFilename = production ?
    `[path][name].[hash:${HASH_LENGTH}].css` :
	'[path][name].css';
	return [
		{
			test: /\.(js|es6)$/,
			exclude: file => (
				/node_modules/.test(file) &&
				!/\.vue\.js/.test(file)
			),
			use: [
				getBabelLoader(options),
				{
					loader: 'debug-loader',
					options: {
						debug: isMock,
					},
				},
			],
		},
		{
			test: /\.vue$/,
			exclude: /(node_modules|.remote)/,
			use: [getVueLoader(options)],
		},
		{
			test: /\.ftl$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						publicPath: '/',
						name: '[path][name].[ext]',
					},
				},
				getStrReplaceLoader(options.define),
				'extract-loader',
				{
					loader: 'ftl-loader',
					options: {
						attrs: [
							'link:href',
							'img:src',
							'include',
							'import',
						],
						interpolate: 'require',
						rules: [
							{
								test: /\.(less|css)$/,
								// 采用重写的loader，该loader将会自动兼容~不写的情况，认为是公共路径
								loader: `!file-loader?name=${cssFileLoaderFilename}!extract-loader!css-loader!postcss-loader!less-re-loader!`,
							},
						],
					},
				},
			],
		},
		{
			type: 'javascript/auto',
			test: /manifest.json/,
			use: [
				{
					loader: 'file-loader',
					options: {
						publicPath: '/',
						name: '[path][name].[ext]',
					},
				},
				'extract-loader',
				'raw-loader',
				getStrReplaceLoader(options.define),
			]
		},
		{
			test: /\.less$/,
			use: [
				'vue-style-loader',
				getCssLoader(options),
				'postcss-loader',
				'less-re-loader'
			],
		},
		{
			test: /\.css$/,
			use: [
				'vue-style-loader',
				getCssLoader(options),
				'postcss-loader',
			],
		},
		{
			test: /\.tpl/,
			use: [
				{
					loader: 'html-loader',
					options: {
						attrs: ['img:src', ':data-src', 'link:href', 'source:src', 'video:src', 'video:poster', 'image:xlink:href'],
						interpolate: true,
					}
				}
			]
		},
		{
			// test.vue.html是vue文件生成的html文件，这种html文件是不需要我们去编译的，所以去掉这个loader
			test: /[^vue]\.(html|htm)/,
			exclude: /(node_modules)/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
						emitFile: true
					},
				},
				{
					loader: 'extract-loader',
				},
				{
					loader: 'html-loader',
					options: {
						attrs: ['img:src', ':data-src', 'link:href', 'source:src', 'video:src', 'video:poster', 'image:xlink:href'],
						interpolate: true,
					}
				}
			]
		},
		{
			test: /\.(txt)$/,
			use: [
				'raw-loader',
			],
		},
		{
			test: /\.art$/,
			loader: {
				loader: 'art-template-loader',
				options: {
					minimize: false,
				},
			},
		},
		{
			test: /\.ico$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						publicPath: '/',
						name: fileLoaderFilename,
					},
				},
			],
		},
		{
			test: /\.(jpe?g|png|gif|eot|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: fileLoaderFilename,
					},
				},
			],
		},
	];
}

module.exports = getLoaders;
