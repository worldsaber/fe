const loaderUtils = require('loader-utils');
// 兼容 ？debug的参数
module.exports = function ftlLoader(content) {
	const { debug } = loaderUtils.getOptions(this);

	if (this.resourceQuery === '?debug') {
		return debug ? content : '';
	}

	return content;
};
