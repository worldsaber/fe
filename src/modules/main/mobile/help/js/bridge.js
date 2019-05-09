const country = __baseUrl__.replace(/\//g, ''); // eslint-disable-line

/* eslint-disable */
let helpMap; // 映射及配置关系
// 详情页信息，区分 wap和app 端
let wapHelpContents;
let appHelpContents;
let conditionsTips; // T&C 有效时间Tips

switch (country) {
case 'ke':
	helpMap = require('packages/fe-help/config/ke/help-map');
	wapHelpContents = require('packages/fe-help/ke/wap');
	appHelpContents = require('packages/fe-help/ke/app');
	conditionsTips = require('packages/fe-help/ke/wap/about/terms-and-conditions/_effect-time.tpl');
	break;
case 'ng':
	helpMap = require('packages/fe-help/config/ng/help-map');
	wapHelpContents = require('packages/fe-help/ng/wap');
	appHelpContents = require('packages/fe-help/ng/app');
	conditionsTips = require('packages/fe-help/ng/wap/about/terms-and-conditions/_effect-time.tpl');
	break;
case 'gh':
	helpMap = require('packages/fe-help/config/gh/help-map');
	wapHelpContents = require('packages/fe-help/gh/wap');
	appHelpContents = require('packages/fe-help/gh/app');
	conditionsTips = require('packages/fe-help/gh/wap/about/terms-and-conditions/_effect-time.tpl');
	break;
default:
	helpMap = require('packages/fe-help/config/ke/help-map');
	wapHelpContents = require('packages/fe-help/ke/wap');
	appHelpContents = require('packages/fe-help/ke/app');
	conditionsTips = require('packages/fe-help/ke/wap/about/terms-and-conditions/_effect-time.tpl');
}
/* eslint-enable */

// 添加 Symbol Name
const addSymbolName = function (obj, pa) {
	return Object.entries(obj).map(([k, v]) => {
		obj[k].name = `h_${Math.random().toString(10).substr(2)}`;

		if (v.children) {
			addSymbolName(v.children, k);
		}
		return v;
	});
};

addSymbolName(helpMap, '');

export {
	helpMap,
	wapHelpContents,
	appHelpContents,
	conditionsTips
};
