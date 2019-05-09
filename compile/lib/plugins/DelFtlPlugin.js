/**
 * 将会删除 *.ftl.js的这种模块
 */

// 参数处理 设置默认值
function DelFtlPlugin() {
}
// webpack 运行时调用 注入compiler对象
DelFtlPlugin.prototype.apply = function apply(compiler) {
	compiler.hooks.compilation.tap('del-ftl-chunk', compilation => {
		const handler = chunks => {
			for (let i = chunks.length - 1; i >= 0; i--) {
				const chunk = chunks[i];
				if (
					chunk.name &&
					chunk.name.endsWith('.ftl')
				) {
					chunks.splice(i, 1);
				}
			}
		};
		compilation.hooks.optimizeChunkModules.tap('del-ftl-chunk', chunks => {
			if (chunks && chunks.length) {
				handler(chunks);
			}
		});
	});
};

module.exports = DelFtlPlugin;
