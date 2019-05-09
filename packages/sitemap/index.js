const fs = require('fs');
const path = require('path');
const pretty = require('pretty');

const { currentCountries, siteList, canonical = 'wap' } = require('./sitemap-config.js');

// 网站版本对应国家/地区区域代码，区域代码可查看 wikipedia(https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
const langMap = {
	ke: 'KE',
	ng: 'NG',
	gh: 'GH'
};

/**
 * 获取 xhtml:link 多语言国家/地区 标签
 * @param {String} hreflang 	语言+国家代码，如 en-KE, en 等
 * @param {String} href 		链接
 */
function getXhtmlLink(hreflang, href) {
	return `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
}

/**
 * href 国家版本模版字符替换，https://xxx/$$/xxx -> https://xxx/ke/xxx
 * @param {*} hrefData 		模版字符串链接
 * @param {*} country 		国家/地区代码
 */
function resolveCountryHref(hrefData, country) {
	let href = '';
	if (typeof hrefData === 'string') {
		href = hrefData.replace('$$', country);
	} else if (typeof hrefData === 'object') {
		href = hrefData[country];
	}
	return href;
}

/**
 * 解析 target 对象, 获取 xml <url>...</url> 字符串
 * @param {Object} target 		{ ke: 'https:xxx', ng: '', gh: '', ... }
 * @param {Array} countries     国家/地区列表
 */
function getXMLUrl(target, countries) {
	// 生成备用网页配置，即相应网页的每种语言/语言区域变体（包括网页自身）
	const defaultSite = getXhtmlLink('en', target[countries[0]]);
	const xhtmlLinks = countries.reduce((sumUrl, country) => {
		const href = target[country];
		const hreflang = `en-${langMap[country]}`;
		const xhtmlLink = getXhtmlLink(hreflang, href);

		return `${sumUrl}${xhtmlLink}`;
	}, defaultSite);

	return Object.values(target).reduce((sum, url) => (
		`${sum}<url> <loc>${url}</loc> ${xhtmlLinks} </url>`
	), '');
}

/**
 * 解析网站配置列表
 * @param {Array} siteList 		site 列表，具体请查看 sitemap-config.js siteList
 * @param {Array} countries     国家/地区列表
 */
function resolveSiteList(siteList = [], countries = ['ke']) {
	return siteList.map(item => {
		const hrefData = item[canonical];

		return countries.reduce((result, country) => {
			result[country] = resolveCountryHref(hrefData, country);
			return result;
		}, {});
	});
}

/**
 * 获取 xml 格式 sitemap 字符串
 * @param {Array} siteList 		site 列表，具体请查看 sitemap-config.js siteList
 * @param {Array} countries     国家/地区列表
 */
function getXMLSitemap(siteList = [], countries) {
	const urlList = resolveSiteList(siteList, countries);

	// 生成备用网页配置，即相应网页的每种语言/语言区域变体（包括网页自身）
	const siteStr = urlList.reduce((str, item) => {
		const urlItem = getXMLUrl(item, countries);
		return `${str}${urlItem}`;
	}, '');

	/* eslint-disable */
	return `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:xhtml="http://www.w3.org/1999/xhtml">${siteStr}</urlset>`;
	/* eslint-enable */
}

/**
 * 创建 sitemap_sportybet.xml 文件
 * @param  {String} data [sitemap 配置]
 */
function createSiteMap(data = '') {
	const filePath = path.join(__dirname, '../../src');
	fs.writeFile(`${filePath}/sitemap_sportybet.xml`, data, err => {
		if (err) {
			console.error(err); // eslint-disable-line
		} else {
			console.log('The sitemap is ready!!!'); // eslint-disable-line
		}
	});
}

// pretty：字符串格式化
const data = pretty(getXMLSitemap(siteList, currentCountries));
createSiteMap(data);
