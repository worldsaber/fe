const RawSource = require('webpack-sources/lib/RawSource');
const ConcatSource = require('webpack-sources/lib/ConcatSource');
// 注入公共脚本的宏
const injectCommonScriptsMacro = `
<#macro __inject_common_scripts__>
<#list __common_scripts__ as script>
<script src="\${script}"></script>
</#list>
</#macro>`;

// 注入页面入口脚本的宏
const injectEntryScriptsMacro = `
<#macro __inject_entry_scripts__>
<#list __entry_scripts__ as script>
<script src="\${script}"></script>
</#list>
</#macro>`;

// 获取 chunk 的 publicPath
function getChunkPublicPath(stats, chunkName) {
	let assetName = stats.assetsByChunkName[chunkName];
	if (assetName.length && typeof assetName === 'object') {
		assetName = assetName[0];
	}
	return `${stats.publicPath}${assetName}`;
}

// 获取 assign 指令
function assignDirective(name, value) {
	if (!name || !value) {
		throw new Error('assign need name and value!');
	}
	return `<#assign ${name}=${value} />\n`;
}

// 参数处理 设置默认值
function FTLPlugin(options) {
	this.options = Object.assign({
		entries: [],
		commons: [],
	}, options);
}

// webpack 运行时调用 注入compiler对象
FTLPlugin.prototype.apply = function apply(compiler) {
	const { commons, entries } = this.options;
	// 编译器已经输出所有的资源后，开始修改入口ftl文件
	// tapable的更新后，只支持webpack4以上这种写法
	compiler.hooks.emit.tapAsync('ftl-plugin', (compilation, callback) => {
		const stats = compilation.getStats();
		// 如果编译报错，就不进行后续的处理
		if (stats.hasErrors()) {
			callback();
			return;
		}

		const statsInfo = stats.toJson({
			hash: true,
			publicPath: true,
			assets: true,
			chunks: false,
			modules: false,
			source: false,
			errorDetails: false,
			timings: false,
		});
		// 通过statsInfo获取的入口，包括所有类型的入口，即ftl，js，html等
		const entrypoints = statsInfo.entrypoints;
		// 页面中需要用到的 JS 脚本的 map
		const allScriptMap = {};
		// 公共脚本的 publicPath
		const commonPublicPaths = commons.map(common => {
			const publicPath = getChunkPublicPath(statsInfo, common);

			allScriptMap[common] = publicPath;

			return publicPath;
		});
		// 公共脚本的 FTL 定义
		const commonDefine = assignDirective('__common_scripts__', JSON.stringify(commonPublicPaths));

		// 入口脚本的处理
		entries.forEach(({ script, template }) => {
			// 入口脚本的 publicPath
			const scriptEntry = [];
			// 主入口文件
			const main = getChunkPublicPath(statsInfo, script);
			const entrypoint = entrypoints[script];
			if (entrypoint) {
				// manifest也在这个里面呢
				const assets = entrypoint.assets;
				assets.filter(asset => !asset.endsWith('.js.map')).forEach(asset => {
					const url = statsInfo.publicPath + asset;
					// 去除掉map
					if (!commonPublicPaths.find(cur => cur === url) && url !== main) {
						scriptEntry.push(url);
					}
				});
			}
			scriptEntry.push(main);
			// 入口脚本的 FTL 定义
			const scriptDefine = assignDirective('__entry_scripts__', JSON.stringify(scriptEntry));

			// 添加入口脚本信息
			if (script) {
				allScriptMap.entry = scriptEntry;
			}

			const allScriptDefine = assignDirective('__all_script_map__', JSON.stringify(allScriptMap));

			// 最终需要插入到 FTL 的内容，包含了脚本路径和插入脚本的宏
			const prepend = [
				allScriptDefine,
				commonDefine,
				scriptDefine,
				injectCommonScriptsMacro,
				injectEntryScriptsMacro,
			].join('');
			const assets = compilation.assets;
			const asset = assets[template];
				// 将宏插入ftl中
			const newSource = new RawSource(prepend);
			if (asset) {
				if (asset.add) {
						// 直接调用向前插入
					asset.children.unshift(newSource);
				} else {
					assets[template] = new ConcatSource(newSource, asset);
				}
			}
		});
		callback();
	});
};

module.exports = FTLPlugin;
