const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebpackBar = require('webpackbar');
const FTLPlugin = require('./plugins/FTLPlugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const RenameChunkPlugin = require('./plugins/RenameChunkPlugin');
const DelFtlPlugin = require('./plugins/DelFtlPlugin');
const { getChunkName } = require('./utils');

const commonStart = /^(modules\/common-)/;

function getBasePlugins(options) {
	const { entries, syncFiles, commons, define, env, module } = options;
	// 公共脚本 chunk
	// 公共文件替换规则 src/modules/commont-wap/* 到src/modules/commont-模块名称-wap/ 这样可以区分所有模块
	const commonChunks4FtlPlugin = commons.map(getChunkName).map(name => {
		if (name && commonStart.test(name)) { // 将每个模块的公共文件独立放置
			name = name.replace(commonStart, `$1${module}-`); // eslint-disable-line
		}
		return name;
	});
	// 入口 chunk
	const entryChunks = entries
	.filter(entry => !!entry.template)
	.map(({
		script,
		template
	}) => ({
		script: script ? getChunkName(script) : '',
		template: getChunkName(template),
	}));
	return [
		new WebpackBar({
			name: (module ? module + '-' : '') + (env || 'webpack')
		}),
		new RenameChunkPlugin({
			name (chunk) {
				if (!chunk.name) {
					chunk.name = (env === 'wap' ? `${module}-mobile/` : `${module}-desktop/`) + chunk.id;
				} else if (commonStart.test(chunk.name)) { // 将每个模块的公共文件独立放置
					// 公共文件替换规则 src/modules/commont-wap/* 到src/modules/commont-模块名称-wap/ 这样可以区分所有模块
					chunk.name = chunk.name.replace(commonStart, `$1${module}-`);
				}
			}
		}),
		new DelFtlPlugin(),
		new VueLoaderPlugin(),
		new CopyWebpackPlugin(syncFiles.map(syncFile => ({ from: syncFile, to: '[path][name].[ext]' }))),
		new webpack.DefinePlugin(define),
		new FTLPlugin({
			entries: entryChunks,
			commons: commonChunks4FtlPlugin
		}),
	];
}

// 获取生产模式下的插件
function getProductionPlugins() {
	return [
		new webpack.HashedModuleIdsPlugin(),
		// 图片压缩
		new ImageminPlugin({
			test: /\.(jpe?g|png|gif|svg)$/i,
			optipng: null,
			pngquant: {
				quality: '65-90',
			},
			jpegtran: {
					// 开启 JPEG 图片渐进显示特性
				progressive: true,
			},
		}),
	];
}

// 获取插件
function getPlugins(options) {
	const { production } = options;
	return getBasePlugins(options).concat(production ? getProductionPlugins() : []);
}

module.exports = getPlugins;
