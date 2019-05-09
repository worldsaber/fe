/*!
 * appcore.js v1.5.9
 * (c) 2014-2018 jianxcao,chaoma
 * Released under the MIT License.
 */
'use strict';

function __$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// 当前浏览器的ua
var ua = window.navigator.userAgent.toLowerCase();
// 真正对外提供的AppCore对象
var AppCore$2 = {};
var eleProto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = eleProto.matches ||
eleProto.matchesSelector ||
eleProto.webkitMatchesSelector ||
eleProto.mozMatchesSelector ||
eleProto.msMatchesSelector ||
eleProto.oMatchesSelector;

// 绑定事件的缓存
var EvtCache = {};
/**
 * 执行代理事件
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, type, selector, callback) {
	return function(e) {
		var match = Helper.closest(e.target, selector, true);
		if (match) {
			var event = Object.assign(createProxy(e), { currentTarget: match });
			// 立即阻止冒泡
			if (event.isImmediatePropagationStopped()) { return; }
			var result = callback.call(match, event);
			if (result === false) {
				e.preventDefault();
				e.stopPropagation();
			}
			return result;
		}
	};
}
var returnTrue = function() { return true; };
var returnFalse = function() { return false; };
var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/;
var eventMethods = {
	preventDefault: 'isDefaultPrevented',
	stopImmediatePropagation: 'isImmediatePropagationStopped',
	stopPropagation: 'isPropagationStopped'
};
/*eslint-disable */
function compatible(event, source) {
	if (source || !event.isDefaultPrevented) {
		source || (source = event);
		var loop = function ( name ) {
			var sourceMethod = source[name];
			var predicate = eventMethods[name];
			event[name] = function() {
				this[predicate] = returnTrue;
				return sourceMethod && sourceMethod.apply(source, arguments);
			};
			event[predicate] = returnFalse;
		};

		for (var name in eventMethods) loop( name );
		try {
			event.timeStamp || (event.timeStamp = Date.now());
		} catch (ignored) { }

		if (source.defaultPrevented !== undefined ? source.defaultPrevented :
	'returnValue' in source ? source.returnValue === false :
	source.getPreventDefault && source.getPreventDefault())	{ event.isDefaultPrevented = returnTrue; }
	}
	return event;
}
function createProxy(event) {
	var key,
		proxy = {
			originalEvent: event
		};
	for (key in event) {
		if (!ignoreProperties.test(key) && event[key] !== undefined) { proxy[key] = event[key]; }
	}

	return compatible(proxy, event);
}
/*eslint-enable */

// 工具对象
var Helper = {
	ua: ua,
	os: /(?:iphone|ipad|ipod)/.test(ua) ? 'ios' : /(?:android|adr )/.test(ua) ? 'android' : 'other',
	// 014-12-23 马超 增加相同命令发送间隔不能低于500ms，防止彩票客户端在iscroll内多次触发命令的bug
	sendCmd: function sendCmd (cmd, type) {
		if (Helper.__lastCmd === cmd) {
			return;
		}
		Helper.__lastCmd = cmd;
		window.setTimeout(function () {
			Helper.__lastCmd = '';
		}, 500);
		// 修改location方式发送命令
		if (type === 'href') {
			window.location.href = cmd;
			return;
		}
		// 默认iframe方式发送命令
		var iframe = document.getElementById('__cmdFrame');
		if (!iframe) {
			iframe = document.createElement('iframe');
			iframe.id = '__cmdFrame';
			document.body.appendChild(iframe);
			iframe.style.display = 'none';
		}
		iframe.src = cmd;
	},

	/**
	 * @name AppCore.helper.loadTextCss
	 * @description 加载文本格式的CSS样式表
	 * @function
	 */
	loadTextCss: function loadTextCss (cssText) {
		if (!cssText) { return; }
		var style = document.createElement('style');
		var head = document.head || document.getElementsByTagName('head')[0];
		var textNode = document.createTextNode(cssText);
		head.appendChild(style);
		style.type = 'text/css';
		style.appendChild(textNode);
	},

	/**
	 * @name AppCore.helper.loadJS
	 * @description 加载单个JS文件(utf-8)，并提供回调
	 * @function
	 */
	loadJS: function loadJS (js, callback) {
		var head = document.getElementsByTagName('head')[0] || document.documentElement || document.body;
		var tag = document.createElement('script');
		tag.type = 'text/javascript';
		tag.charset = 'UTF-8';
		var done = false;
		tag.onload = tag.onreadystatechange = function() {
			if (!done && (!this.readyState || {
				loaded: 1,
				complete: 1
			}[this.readyState])) {
				// 重置状态
				done = true;
				tag.onload = tag.onreadystatechange = null;
				this.parentNode.removeChild(this);
				callback && callback();
				// 释放引用，内存回收
				head = tag = null;
			}
		};
		tag.src = js;
		head.appendChild(tag, head.lastChild);
	},

	/**
	 * @name AppCore.helper.format
	 * @description 模版格式化
	 * @function
	 */
	format: function format (string, source) {
		if (source === undefined || source === null) {
			return string;
		}
		var isArray = true;
		var type = Object.prototype.toString.call(source);
		// 检测数据源
		var data = type === '[object Object]' ? (isArray = false, source) : type === '[object Array]' ? source : Array.prototype.slice.call(arguments, 1);
		var N = isArray ? data.length : 0;
		// 执行替换
		return String(string).replace(/\{([\w\.]+)\}/g, function (match, index) {
			var isNumber = /^\d+$/.test(index);
			var n;
			var val;
			if (isNumber && isArray) {
				n = parseInt(index, 10);
				return n < N ? data[n] : match;
			}
			// 数据源为对象，则遍历逐级查找数据
			var fnPath = index.split('.');
			val = data;
			for (var i = 0; i < fnPath.length; i++) {
				val = val[fnPath[i]];
			}
			return val === undefined ? match : val;
		});
	},

	/**
	 * 检测App的build号，仅内部使用
	 * build是app的build号码 或者想要检测的app的环境，比如 caipiao
	 * osConf: {
	 * 	os: 1,
	 *  android: 2
	 * }
	 * 通过比较确定版本号码的大小
	 */
	checkBuild: function checkBuild (build, osConf) {
		if (typeof build === 'string' && AppCore$2[build]) {
			build = AppCore$2[build].version();
		}
		return build >= (osConf[this.os] || Infinity);
	},
	/**
	 * 是否是一个函数
	 */
	isFunction: function isFunction (fun) {
		return typeof fun === 'function';
	},
	isArray: function isArray (arr) {
		return arr && arr.length && Object.prototype.toString.call(arr) === '[object Array]';
	},
	/**
	 * dom是否准备好
	 * @param {function} callback
	 */
	ready: function ready (callback) {
		var readyReg = /complete|loaded|interactive/;
		if (readyReg.test(document.readyState) && document.body) {
			callback();
		} else {
			document.addEventListener('DOMContentLoaded', callback, false);
		}
	},
	extend: function extend (target) {
		var args = [], len = arguments.length - 1;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}
		target = Object(target);
		for (var index = 0; index < args.length; index++) {
			var source = args[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	},
	// 根据给定元素查找该select是否匹配
	matches: function matches (el, selector) {
		if (!el || el.nodeType !== 1) {
			return false;
		}
		if (vendor) {
			return vendor.call(el, selector);
		}
		// 不支持原生的match，则修复下
		// 注意修复的性能比较低
		var nodes = el.parentNode.querySelectorAll(selector);
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] === el) { return true; }
		}
		return false;
	},
	closest: function closest (element, selector, checkYoSelf) {
		var parent = checkYoSelf ? element : element.parentNode;
		while (parent && parent !== document) {
			if (Helper.matches(parent, selector)) {
				return parent;
			}
			parent = parent.parentNode;
		}
	},
	// 简单事件代理，一次只能代理一个element
	delegate: function delegate (element, type, selector, callback) {
		if (element && element.nodeType === 1 && typeof type === 'string' &&
			typeof selector === 'string' && Helper.isFunction(callback)) {
			var listenerFn = listener.apply(element, arguments);
			if (!element.__cjx__event__id) {
				element.__cjx__event__id = +new Date();
			}
			var id = element.__cjx__event__id;
			EvtCache[id] = EvtCache[id] || [];
			EvtCache[id].push({
				callback: callback,
				listenerFn: listenerFn,
				selector: selector,
				type: type
			});
			element.addEventListener(type, listenerFn, false);
		}
	},
	// 简单代理卸载
	undelegate: function undelegate (element, type, selector, callback) {
		if (element && element.__cjx__event__id && EvtCache[element.__cjx__event__id] && typeof type === 'string') {
			var caches = EvtCache[element.__cjx__event__id];
			if (Helper.isFunction(selector)) {
				callback = selector;
				selector = null;
			}
			caches.forEach(function (cache, index) {
				if (!cache.type === type) {
					return;
				}
				if (typeof selector === 'string' && !cache.selector === selector) {
					return;
				}
				if (Helper.isFunction(callback) && !cache.callback === callback) {
					return;
				}
				element.removeEventListener(type, caches[index].listenerFn);
				delete caches.splice(index, 1);
				delete element.__cjx__event__id;
				if (!caches.length) {
					delete EvtCache[element.__cjx__event__id];
				}
			});
		}
	},
	prepend: function prepend(node, childNode) {
		if (!childNode || (typeof childNode !== 'string' && childNode.nodeType !== 1)) {
			return;
		}
		if (!node || node.nodeType !== 1) {
			return;
		}
		if (!node.childNodes.length) {
			return Helper.append(node, childNode);
		}
		if (typeof childNode === 'string') {
			var div = document.createElement('div');
			div.innerHTML = childNode;
			var fragment = document.createDocumentFragment();
			var nodes = Array.prototype.slice.call(div.childNodes, 0);
			nodes.forEach(function (node) {
				fragment.appendChild(node);
			});
			node.insertBefore(fragment, node.childNodes[0]);
		} else if (childNode) {
			node.insertBefore(childNode, node.childNodes[0]);
		}
	},
	// 插入节点
	append: function append (node, childNode) {
		if (!childNode || (typeof childNode !== 'string' && childNode.nodeType !== 1)) {
			return;
		}
		if (!node || node.nodeType !== 1) {
			return;
		}
		if (typeof childNode === 'string') {
			var div = document.createElement('div');
			div.innerHTML = childNode;
			var fragment = document.createDocumentFragment();
			var nodes = Array.prototype.slice.call(div.childNodes, 0);
			nodes.forEach(function (node) {
				fragment.appendChild(node);
			});
			node.appendChild(fragment);
		} else if (childNode) {
			node.appendChild(childNode);
		}
	},
	/**
	 * @param {string|node|array[node]} selectors  querySelector方法的选择器
	 */
	remove: function remove (selector) {
		var doms;
		if (!selector) {
			return;
		}
		if (typeof selector === 'string') {
			doms = document.body.querySelectorAll(selector);
		} else if (selector.nodeType) {
			doms = [selector];
		} else if (selector.length) {
			doms = Array.prototype.slice.call(selector, 0);
		}
		if (doms) {
			var nodes = Array.prototype.slice.call(doms, 0);
			nodes.forEach(function (dom) {
				if (dom && dom.parentNode) {
					dom.parentNode.removeChild(dom);
				}
			});
		}
	},
	addClass: function addClass (el, cls) {
		if (!el || !el.nodeType === 1) {
			return;
		}
		/* istanbul ignore if */
		if (!cls || !cls.trim()) {
			return;
		}

		/* istanbul ignore else */
		if (el.classList) {
			if (cls.indexOf(' ') > -1) {
				cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
			} else {
				el.classList.add(cls);
			}
		} else {
			var cur = ' ' + el.getAttribute('class') + ' ';
			if (cur.indexOf(' ' + cls + ' ') < 0) {
				el.setAttribute('class', (cur + cls).trim());
			}
		}
	},
	removeClass: function removeClass (el, cls) {
		if (!el || !el.nodeType === 1) {
			return;
		}
		/* istanbul ignore if */
		if (!cls || !cls.trim()) {
			return;
		}
		/* istanbul ignore else */
		if (el.classList) {
			if (cls.indexOf(' ') > -1) {
				cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
			} else {
				el.classList.remove(cls);
			}
		} else {
			var cur = ' ' + el.getAttribute('class') + ' ';
			var tar = ' ' + cls + ' ';
			while (cur.indexOf(tar) >= 0) {
				cur = cur.replace(tar, ' ');
			}
			el.setAttribute('class', cur.trim());
		}
	},
	findIndex: function findIndex (array, fun) {
		if (!Helper.isFunction(fun) || Helper.isArray(fun)) {
			return -1;
		}
		if (Array.prototype.findIndex) {
			return Array.prototype.findIndex.call(array, fun);
		}
		for (var i = 0, l = array.length; i < l; i++) {
			if (fun.call(array, array[i], i)) {
				return i;
			}
		}
		return -1;
	}
};
AppCore$2.helper = Helper;


// array indexOf, forEach

/**
 * 内部App管理模块
 */
var Apps = {
	// App缓存
	cache: {},

	// 保留插入的App顺序
	cacheIndex: [],
	/**
	 * @param {function} fn	cacheIndex会被当作参数传递给此函数，返回的数组作为新的cacheIndex
	 * @description 调整cacheIndex的元素顺序
	 */
	setCacheIndex: function setCacheIndex (fn) {
		if (Helper.isFunction(fn)) {
			var cacheIndex = fn(this.cacheIndex.slice(0));
			this.cacheIndex = Helper.isArray(cacheIndex) ? cacheIndex : [];
		}
	},
	/**
	 * @privateEntry {boolean} [privateEntry=false] 是否注册到私有入口： AppCore[appName]
	 * @param {string} appName 注册的环境标识，比如 weixin
	 * @param {object} appConfig 注册的配置内容，其中<br>
	 *                           appConfig.is 方法作为判断环境之用，不引用到任何入口<br>
	 *                           appConfig.version 方法仅仅添加到私有入口中<br>
	 *                           appConfig.ready 方法仅仅添加到私有入口中<br>
	 *                           以 _ 开头的方法会被忽略<br>
	 *                           非函数成员会被忽略<br>
	 *                           其他方法的同名代理方法会被扩展到 AppCore 上<br>
	 *                           如果privateEntry为true，则同步扩展到 AppCore[appName] 上
	 * @description 注册一个App到AppCore
	 */
	reg: function reg (privateEntry, name, config) {
		if (typeof privateEntry !== 'boolean') {
			config = name;
			name = privateEntry;
			privateEntry = false;
		}
		var cache = this.cache[name];
		var conf = config || {};
		var privateFns = AppCore$2[name] = AppCore$2[name] || {};
		if (!cache) {
			this.cacheIndex.push(name);
			cache = this.cache[name] = {};
		}

		// 扩展所有的方法到私有缓存上
		Helper.extend(cache, conf);

		// 检查新插入的方法，进行不同的扩展处理
		for (var methodName in conf) {
			if (Object.prototype.hasOwnProperty.call(conf, methodName)) {
				var method = conf[methodName];
				// version / ready / sendCmd 作为通用方法，仅仅能保存到私有命名空间上
				var isPrivateMethod = /^(?:version|ready|sendCmd)$/.test(methodName) || methodName.indexOf('_') === 0;

				// is 方法作为核心方法仅仅保存在Apps私有的缓存上
				if (methodName !== 'is' && Helper.isFunction(method)) {
					// version / ready 作为通用方法，强制存到私有命名空间上
					if (privateEntry || isPrivateMethod) {
						privateFns[methodName] = method;
					}
					// 非私有方法扩展到主入口上
					if (!isPrivateMethod) {
						Apps.extendCore(methodName);
					}
				}
			}
		}
	},
	// 分析当前环境是什么
	is: function is () {
		var appName = [];
		var cache = Apps.cache;
		this.cacheIndex.forEach(function (name, index) {
			var app = cache[name];
			if (Helper.isFunction(app.is) && app.is(Helper.ua, Helper.os) === true) {
				appName.push(name);
			}
		});
		return appName;
	},
	// 查找命中的环境配置中，有配置方法的数据
	findMethodOwner: function findMethodOwner (method) {
		var cache = Apps.cache;
		var env = Apps.is();
		return env[Helper.findIndex(env, function (appName) { return Helper.isFunction(cache[appName][method]); })];
	},
	// 扩展AppCore自查询方法
	// 内部使用
	extendCore: function extendCore (method) {
		// _开始是内部方法，不让外部访问
		if (!method || AppCore$2[method] || method.indexOf('_') === 0) {
			return;
		}
		// 找到该方法的hook，如果没有设置空对象
		var hooks = Apps.hooks[method] || {};
		// 扩展同名方法
		AppCore$2[method] = function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];

			// 通过findMethodOwner找到要调用具体环境
			var appName = Apps.findMethodOwner(method);
			//  准备参数
			var arg = Array.prototype.slice.call(args, 0);
			// 是否有默认的hook方法，如果有调用默认并返回，否则返回undefined
			// 没有具体环境就是调用hook里面默认的方法
			if (!appName) {
				return hooks.defaultFn ? hooks.defaultFn.apply(this, arg) : undefined;
			}
			// 通过app
			var fn = Apps.cache[appName][method];
			// 有hook，通过hook的run方法
			if (hooks.run) {
				// 追加三个参数用于hook修正
				return hooks.run.apply(this, [fn, appName, Apps.cache[appName]].concat(arg));
			}
			// 没有hook直接调用
			return fn.apply(this, arg);
		};
	},
	// 注册钩子
	regHook: function regHook (method, obj) {
		if (!method || !obj) {
			return;
		}
		if (!obj.defaultFn && !obj.run) {
			return;
		}
		Apps.hooks[method] = obj;
	},
	// 扩展hook钩子
	hooks: {
		/**
		 * @name AppCore.sendCmd
		 * @param  {string} cmd  要发送的客户端命令
		 * @param  {type} [type=iframe] 发送客户端命令的方式，但是无任何互调通知。可选 href / iframe
		 * @description 用指定的方式发送客户端命令
		 * @function
		 */
		sendCmd: {
			defaultFn: function defaultFn(cmd, type) {
				Helper.sendCmd(cmd, type || 'iframe');
			},
			// run(fn, appName, allAppMethod, ...otherParam)
		}
	}
};

/**
 * 立即注册sendCmd方法
 * 之所有没有直接扩展到AppCore上，就是为了提供sendCmd覆盖重写的可能
 */
Apps.extendCore('sendCmd');

/**
 * 绑定cmd命令的默认监听
 */
Helper.ready(function () {
	Helper.delegate(document.body, 'click', '*[cmd]', function(e) {
		var cmd = String(this.getAttribute('cmd') || this.getAttribute('data-cmd'));
		// 由分享模块处理
		if (!cmd || cmd === 'share') {
			return;
		}
		// AppCore.XXX(para1, para2...);
		// 指定AppCore调用方法
		var result = cmd.match(/^\s*AppCore\s*\.\s*([a-zA-Z$_]+)\s*\(([^)]*)\)/);
		var dot = /^(?:"|')+|(?:"|')+$/g;
		var param = [];
		if (result && result.length > 1) {
			if (result[2]) {
				param = result[2].split(',');
				param = param.map(function (current) { return current.trim().replace(dot, ''); });
			}
			// 查到指定方法
			if (AppCore$2[result[1]]) {
				e.preventDefault();
				return AppCore$2[result[1]].apply(AppCore$2, param);
			}
		}
		// 查找当前应用名称
		var appId = window.appId || document.body.id;
		var detectApp = Apps.is()[0];
		if (AppCore$2.getPrivateProto) {
			// cmd格式  netescaipiao://hall||neteshappybuy://hall
			// 多条命令用||隔开
			var cmds = cmd.split('||');
			// 获取当前的协议类型，如 netscaipiao
			var protocol = AppCore$2.getPrivateProto();
			// 如果取到了协议，就按协议走
			if (protocol) {
				if (typeof protocol === 'string') {
					protocol = [protocol];
				}
				Helper.findIndex(protocol, function (data) {
					var index = Helper.findIndex(cmds, function (one) { return one.trim().indexOf(data) === 0; });
					if (index > -1) {
						cmd = cmds[index];
						return true;
					}
				});
			}
		}
		// window.inMyApp兼容新版的 pageMaker判断
		if ((detectApp && detectApp === appId) || window.inMyApp) {
			// 没有协议就检查当前环境是否需要跳转命令
			// 如果在当前项目App内嵌，就阻止元素默认行为
			e.preventDefault();
		}
		// 发送命令
		// 只有一个的时候取第一个命令，多个的时候也取第一个命令
		AppCore$2.sendCmd(cmd.split('||')[0]);
	});
});

/**
 * @name  AppCore.login
 * @param {string} [url=document.URL] 登录成功后要返回的地址
 * @param {function} [success=noop] 登录成功回调，未必会触发，依赖于执行环境
 * @param {function} [fail=noop] 登录失败或取消回调，未必会触发，依赖于执行环境
 * @description AppCore登录模块统一接口，依赖其他子模块挂接，优先调用内嵌App的登录功能
 * @function
 *
 * @example
 * AppCore.login();
 *
 * @example
 * AppCore.login(document.URL, function(data){
 *     //如果有回调，则不会主动跳转到 document.URL
 *     //data未必会有值，而且不同的执行环境，内容不一样
 *     alert("登录成功");
 * },function(reason){
 *     var text = {
 *         cancel : "取消",
 *         fail : "失败"
 *     }[reason] || "错误";
 *     alert("登录"+ text);
 * });
*/
Apps.regHook('login', {
	defaultFn: function defaultFn () {
		console.log('当前环境不支持登录');
	},
	run: function run (fn, appName, cache, url, success, fail) {
		// 检查可选参数
		if (Helper.isFunction(url)) {
			fail = success;
			success = url;
			url = 0;
		}
		// 2015-11-09 增加url数组处理
		var okUrl = url || document.URL;
		var cancelUrl;
		if (Helper.isArray(url)) {
			okUrl = url[0];
			cancelUrl = url[1] || '';
		}
		var callbacks = {
			jump: function jump (url) {
				if (window.location.href === url) {
					return window.location.reload(true);
				}
				window.location.href = url;
			},
			success: Helper.isFunction(success) ? success : function() {
				callbacks.jump(okUrl);
			},
			fail: Helper.isFunction(fail) ? fail : function() {
				cancelUrl && callbacks.jump(cancelUrl);
			}
		};
		// 调用登录模块
		fn(okUrl, cancelUrl, callbacks.success, callbacks.fail);
	}
});

__$styleInject("/* \n * 通用分享弹层\n */\n#shareBoxLayout,#shareBoxImgLoading{\n    position: fixed;\n    z-index: 99999;\n    left: 0;\n    top:0;\n    width: 100%;\n    height: 100%;\n    background: rgba(0,0,0,.7) url(data:image/png;base64,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) no-repeat 87% 5%;\n    background-size: 75% auto;\n}\n#shareBoxImgLoading{\n\tposition: absolute;\n\twidth: 1px;\n\theight: 1px;\n\tleft: -9999px;\n\ttop: -9999px;\n}\n.share,*[cmd=share]{\n\tcursor: pointer;\n}", {});

// 扩展工具函数
Helper.extend(Helper, {
	showLayout: function showLayout(app, id, htmlMaker) {
		var layoutId = 'shareBoxLayout';
		Helper.remove('#' + layoutId + ',#shareBoxImgLoading');
		Helper.append(document.body, '<div id="' + layoutId + '"></div>');
		var layout = document.body.querySelector('#' + layoutId);
		Helper.addClass(layout, 'appShare_' + app);
		// 延迟绑定，防止被透点
		window.setTimeout(function () {
			layout.addEventListener('click', Helper.hideLayout, false);
		}, 800);
	},
	hideLayout: function hideLayout() {
		Helper.remove('#shareBoxLayout');
	},
	preloadLayout: function preloadLayout() {
		if (!document.body.querySelector('#shareBoxImgLoading')) {
			Helper.ready(function () {
				var div = document.createElement('div');
				div.id = 'shareBoxImgLoading';
				document.body.appendChild(div);
			});
		}
		this.preloadLayout = function() {};
	}
});

// 检查转化分享对象
var checkShareObj = function(shareConf) {
	var conf = (Helper.isFunction(shareConf) ? shareConf() : shareConf) || {};
	// 2015-04-16 增加对相对图片地址的支持
	// 2015-07-17 马超 增加对 // 格式图片路径支持
	conf.img = (conf.img || conf.image || '').replace(/^\/\//, window.location.protocol + '\/\/');
	var img = conf.img;
	if (img && !/^http/i.test(img)) {
		conf.img = document.URL.match(
			img.substr(0, 1) === '/' ?
			/^http.+?\/\/[^/]+/ :
			/^http.+?\/\/.+\//
		)[0] + img;
	}
	// 映射标准字段，并保留扩展字段
	return Helper.extend({
		title: document.title,
		link: conf.url || document.URL,
		linkUrl: conf.linkUrl || conf.url || document.URL,
		desc: conf.des || conf.content || document.title,
		imageUri: conf.img
	}, conf, {
		// 按照key顺序获取share的内容
		get: function get() {
			var keys = [], len = arguments.length;
			while ( len-- ) keys[ len ] = arguments[ len ];

			var	val;
			var share = this;
			keys.forEach(function (key) {
				val = val || share[key];
			});
			return val;
		}
	});
};

/**
 * @name  AppCore.share
 * @param {object|function} obj_or_fn 分享配置，内容包括：title / link(url) / desc(content) / img(image)<br>
 *                                    可以为函数，即每次分享的时候，获取最新的分享内容
 * @param {function} [callback=noop] 分享回调，未必会触发，依赖于执行环境
 * @description AppCore分享模块统一接口，依赖其他子模块挂接<br>调用接口后，会绑定 .share 元素，或链接为 #share 或 cmd属性为share 的元素点击行为
 * @function
 *
 * @example
 * AppCore.share({
 *     img : "xxx.jpg",
 *     url : "xxx.html",    //可选，默认 document.URL
 *     title : "这是分享标题",
 *     desc : "这是分享内容"
 * });
 *
 * @example
 * AppCore.share(function(){
 *     return shareObj;
 * }, function(ret, txt){
 *     alert("分享"+ (ret ? "成功":"失败"));
 * });
 */
var hookObj;
Apps.regHook('share', hookObj = {
	defaultFn: function defaultFn () {
		console.log('当前环境暂时不支持分享');
	},
	run: function run (fn, appName, cache, obj, callback) {
		var shareNow = Helper.isFunction(cache.shareNow) ? cache.shareNow : hookObj.defaultFn;
		// 将包装后的参数传给app的share函数
		fn(function () { return checkShareObj(obj); }, function (ret, message) {
			var arg = [], len = arguments.length - 2;
			while ( len-- > 0 ) arg[ len ] = arguments[ len + 2 ];

			if (Helper.isFunction(callback)) {
				// 如果有回调，则关闭蒙层提示，2016-02-02 马超 增加
				Helper.hideLayout();
				callback.apply(void 0, [ !!{
					ok: 1,
					success: 1,
					confirm: 1,
					'true': 1
				}[ret], message ].concat( arg ));
			}
		});
		// 绑定页面监听
		hookObj.shareNow = shareNow;
		if (!this.bindDocListen && !(obj || {}).initOnly) {
			this.bindDocListen = 1;
			Helper.ready(function () {
				Helper
				.delegate(document.body, 'click', '.share,a[href*=\'#share\'],a[href=\'share://\'],[cmd=share]', function (e) {
					hookObj.shareNow(e);
					e.preventDefault();
				});
			});
		}
	}
});

// 注册login的钩子
// 注册分享钩子
// AppCore对外提供的方法
Helper.extend(AppCore$2, {
	/**
	 * @name AppCore.getAppName
	 * @param  {boolean} [getAll=false]  是否返回所有命中的环境名称
	 * @return {string|string[]} 默认返回当前最为匹配的一个环境名称，如果getAll为true，则返回所有命中的环境名称，比如 ["weixin", "wap"]
	 * @description 查询当前的环境名称，返回诸如 weixin、yixin 等字符串标识符，或 wap；
	 * @function
	 */
	getAppName: function getAppName (getAll) {
		var appNames = Apps.is();
		return getAll ? appNames : appNames[0];
	},
	/**
	 * @name AppCore.findMethodOwner
	 * @param  {string} method  要查询的方法名
	 * @return {string} 返回指定方法名所属的环境
	 * @description 查找命中的环境配置中，有配置方法的数据
	 * @function
	 */
	findMethodOwner: function findMethodOwner(method) {
		return Apps.findMethodOwner(method);
	},
	/**
	 * @privateEntry {boolean} [privateEntry=false] 是否注册到私有入口： AppCore[appName] - 私有接口即只存在于某个环境下
	 * @param {string} appName 注册的环境标识，比如 weixin
	 * @param {object} appConfig 注册的配置内容，其中<br>
	 *                           appConfig.is 方法作为判断环境之用，不引用到任何入口<br>
	 *                           appConfig.version 方法仅仅添加到私有入口中<br>
	 *                           appConfig.ready 方法仅仅添加到私有入口中<br>
	 *                           以 _ 开头的方法会被忽略<br>
	 *                           非函数成员会被忽略<br>
	 *                           其他方法的同名代理方法会被扩展到 AppCore 上<br>
	 *                           如果privateEntry为true，则同步扩展到 AppCore[appName] 上
	 * @description 注册一个App到AppCore
	 */
	reg: function reg(privateEntry, name, config) {
		return Apps.reg(privateEntry, name, config);
	},
	/**
	 * @name AppCore.setCacheIndex
	 * @param {function} fn	cacheIndex会被当作参数传递给此函数，返回的数组作为新的cacheIndex
	 * @description 调整cacheIndex的元素顺序
	 * @function
	 */
	setCacheIndex: function setCacheIndex(fn) {
		return Apps.setCacheIndex(fn);
	}
});

/**
 * @name AppCore.rrzcp
 * @description 易信控制方法集合
 * @namespace
 */
Apps.reg('rrzcp', {
	is: function is(ua) {
		return /(^|\s)client\/caipiao_client/.test(ua);
	},
	ready: function ready(fn) {
		if (window.CPJsApi) {
			return fn(window.CPJsApi);
		}
		document.addEventListener('CPJsBridgeReady', function () {
			fn(window.CPJsApi);
		}, false);
	}
});

// 彩票App登录模块
function shortCmd(url) {
	// backUri中在低版本中，不支持 #
	// 去掉可能重复的参数token和udid
	url = AppCore$2.caipiao._rmUrlPara(url, ['token', 'udid', 'sessionId', 'username']);
	AppCore$2.sendCmd('rrzcp://login?backUri=' + encodeURIComponent(url));
}

Apps.reg('rrzcp', {
	login: function login(okUrl, cancelUrl, success, fail) {
		AppCore$2.rrzcp.ready(function (jsapi) {
			// 以防万一，做一下兼容处理
			if (!jsapi || !jsapi.account || !jsapi.account.login) {
				return shortCmd(okUrl);
			}
			// 第一个参数给未来配置功能预留
			jsapi.account.login({}, function (ret) {
				ret = typeof ret === 'string' ? JSON.parse(ret) : ret;
				switch (ret.result) {
				case 'success':
				case 'sucess':
					success();
					break;
				default:
					fail();
				}
			});
		});
	}
});

module.exports = AppCore$2;
