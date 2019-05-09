
const precache = [];
const cndBasePath = __cdnBasePath__; // eslint-disable-line
const countryConfig = __countryConfig__; // eslint-disable-line
const baseUrl = __baseUrl__; // eslint-disable-line

self.addEventListener('install', () => {
	self.skipWaiting && self.skipWaiting();
});

self.addEventListener('activate', () => {
	self.clients && self.clients.claim && self.clients.claim();
});
importScripts(cndBasePath + 'sw-toolbox.js');

self.toolbox.options.debug = self.location.search.indexOf('debug') !== -1;
self.toolbox.options.networkTimeoutSeconds = 3;

// sw直接从网络加载
self.toolbox.router.get('/sw.js', self.toolbox.networkOnly);
// 所有静态资源下的url全部缓存并采取缓存先的原则
const cacheList = new RegExp(`https:\/\/(${self.location.origin.replace('\\', '\\\\')}|virtual\\.golden-race\\.net|www\\.google-analytics\\.com).*\\.(jpg|svg|gif|png|webp|eot|woff|ttf|js|css)`);

self.toolbox.router.get(cacheList, self.toolbox.cacheFirst, {
	cache: {
		name: 'static' + countryConfig.countryCode,
		maxEntries: 200
	}
});

// 非 /common/avatar/*.png 头像资源
const cacheCdnList = new RegExp('https:\/\/(s\\.sporty\\.net|test\\.sporty\\.net)\/(?!common\/avatar).*\\.(jpg|svg|gif|png|webp|eot|woff|ttf|js|css)');

self.toolbox.router.get(cacheCdnList, self.toolbox.cacheFirst, {
	cache: {
		name: 'static' + countryConfig.countryCode,
		maxEntries: 200
	}
});

/**
 * /common/avatar/*.png 头像资源。由于这里跨域获取头像在 share my bet 中绘制失败，会报如下信息
 * The FetchEvent for "https://test.sporty.net/common/avatar/4.png" resulted in a network error response: an "opaque" response was used for a request whose type is not no-cors
 */
const cdnSource = new RegExp('https:\/\/(s\\.sporty\\.net|test\\.sporty\\.net)\/common\/avatar\/.*\\.(jpg|svg|gif|png|webp)/');

self.toolbox.router.get(cdnSource, self.toolbox.cacheFirst, {
	cache: {
		name: 'static' + countryConfig.countryCode,
		maxEntries: 200
	},
	origin: /.*\.sporty\.net/
});

// 所有主页面的请求
const netErr = new RegExp(`^https:\/\/www\.sportybet\.com${baseUrl}m`);
const body = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,target-densitydpi=high-dpi,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>net work error</title>
		<style>
			html,body{
				background: #f2f3f5;
				margin: 0;
			}
			.title{
				margin-left: 16px;
				font-size: 20px;
				font-weight: bold;
				font-style: normal;
				font-stretch: normal;
				line-height: 0.84;
				letter-spacing: normal;
				color: #5f5f5f;
				margin-top: 70px;
			}
			.tips{
				margin-left: 16px;
				font-size: 12px;
				font-weight: 500;
				font-style: normal;
				font-stretch: normal;
				line-height: 1.4;
				letter-spacing: normal;
				color: #5f5f5f;
				margin-top: 20px;
			}
			.retry{
				margin-top: 36px;
				margin-left: 16px;
				width: 160px;
				height: 48px;
				line-height: 48px;
				border-radius: 2px;
				background-color: #0d9737;
				text-align: center;
				font-size: 14px;
				font-weight: bold;
				color: #ffffff;
			}
		</style>
	</head>
	<body>
		<p class="title">Cannot get network</p>
		<p class="tips">Please check your internet connection and try again.</p>
		<div class="retry" onclick="location.reload(true)">Retry</div>
	</body>
	</html>
`;

self.toolbox.router.get(netErr, (request, values, options) => fetch(request)
	// 页面请求出错
	.catch(e => Promise.resolve(new Response(
		body, {
			status: 200,
			statusText: 'OK',
			url: request.url,
			headers: new Headers({
				'cache-control': 'no-cache',
				connection: 'keep-alive',
				'content-language': 'zh-CN',
				'content-type': 'text/html;charset=UTF-8'
			})
		}
	))));

// 针对常用请求直接全部缓存起来
precache.forEach(one => {
	self.toolbox.cache(one, {
		cache: {
			name: 'static' + countryConfig.countryCode
		}
	}).catch(() => {});
});
