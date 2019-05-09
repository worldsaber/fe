const path = require('path');
const fs = require('fs');
// 是否打开假数据
const isMock = false;

const baseUrl = '/ke/';
// 必须要加这个startUrl因为，在manifest.json描述文件中要用，在json文件中无法使用计算变量，所以必须写死
const startWapUrl = '/ke/m/';
const cdnBasePath = baseUrl + 'main/';
const CDN = process.env.CDN ? ('//' + process.env.CDN) : '//test.sporty.net';
const publicPath = CDN + cdnBasePath;
const countryConfig = {
	currency: 'KES',
	showCurrency: 'KES',
	countryName: 'Kenya',
	// showCurrency: 'KSh',
	countryCode: '254',
	// 产品id，主要是push使用
	productCode: 6,
};
const fbSharePic = '//s.sporty.net/ke/main/res/4d459b4acb80fca0e81993f8e5910ebd.png';

const define = {
	__cdn__: JSON.stringify(publicPath),
	__cdnBasePath__: JSON.stringify(cdnBasePath),
	__cdnOrigin__: JSON.stringify(CDN),
	__debug__: JSON.stringify(isMock),
	__baseUrl__: JSON.stringify(baseUrl),
	__countryConfig__: JSON.stringify(countryConfig),
	__fbSharePic__: JSON.stringify(fbSharePic),
	__startWapUrl__: JSON.stringify(startWapUrl),
};

/**
 *
 * @param {*} modules 要编译的模块必须是数组格式
 */
module.exports = function (modules) {
	const moduleDir = path.resolve(__dirname, 'modules');
	if (!modules || !modules.length) {
		modules = fs.readdirSync(moduleDir); // eslint-disable-line
	}
	// sw必须编译
	if (!~modules.indexOf('sw')) {
		modules.push('sw');
	}
	return modules.reduce((res, module) => {
		let m = module.split('-');// eslint-disable-line
		// 表示是pc还是wap
		const client = m[1];
		m = m[0];
		const modulePath = path.resolve(moduleDir, m);
		const getCfg = require(modulePath); // eslint-disable-line
		if (!getCfg || !(typeof getCfg === 'function')) {
			return res;
		}
		const one = getCfg(publicPath, isMock, define);
		return res.concat(one.length && client && ['pc', 'wap'].indexOf(client) > -1 ? one.filter(cur => cur.env === client) : one);
	}, []);
};
