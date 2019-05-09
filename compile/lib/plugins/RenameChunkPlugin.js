/**
 *
 * 对一些没有模块名的模块，比如动态加载的模块，如果用户不手动设置模块名，则只有id，这个时候可以自定义下模块名
 */

// 参数处理 设置默认值
function RenameChunkPlugin(options) {
	this.options = options || {};
}
function setName (chunk, name) {
	// 如果是函数交给用户自己处理
	if (typeof name === 'function') {
		name(chunk);
		// 是个字符串，直接冲定义name，但是为了防止重复，加上id
	} else if (typeof name === 'string') {
		chunk.name = name + chunk.id;
	}
}

// webpack 运行时调用 注入compiler对象
RenameChunkPlugin.prototype.apply = function apply(compiler) {
	const { name } = this.options;
	compiler.hooks.compilation.tap('change-chunk-name-plugin', compilation => {
		compilation.hooks.afterOptimizeChunkIds.tap('change-chunk-name', chunks => {
			if (chunks && chunks.length) {
				const chunks = compilation.chunks;
				chunks.forEach(chunk => {
					setName(chunk, name);
				});
			}
		});
	});
};

module.exports = RenameChunkPlugin;
