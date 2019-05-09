const pify = require('pify');
const processResult = require('less-loader/dist/processResult');
const less = require('less');
const getOptions = require('./getOptions');
// 重写loader入口,调用自己的getOptions方法，去增加2个plugin
const render = pify(less.render.bind(less));

function lessLoader(source) {
	const loaderContext = this;
	const options = getOptions(loaderContext);
	const done = loaderContext.async();
	const isSync = typeof done !== 'function';
	if (isSync) {
		throw new Error(
      'Synchronous compilation is not supported anymore. See https://github.com/webpack-contrib/less-loader/issues/84'
    );
	}
	processResult(loaderContext, render(source, options));
}

module.exports = lessLoader;
