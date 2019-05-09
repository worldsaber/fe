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
 * @name AppCore.caipiao
 * @description 彩票App控制方法集合，除了version方法外，主要方法都暴露在 AppCore 以及 AppCore.caipiao 下，需要 cpwap 提供同样的API承接。<br>
 *              比如方法 hall 同时存在两个入口： AppCore.hall() 以及 AppCore.caipiao.hall()， 其中<br>
 *              AppCore.hall 是通用代理接口，会根据当前环境自动查找相关方法<br>
 *              AppCore.caipiao.hall 是特定的彩票APP的 hall 方法
 * @namespace
 */
Apps.reg('sportybet', {
	// 私有核心方法，不暴露
	is: function is(ua, os) {
		return ua.indexOf('sportybet') >= 0 || ua.indexOf('sportybetclient') >= 0;
	},
	// 获取app的协议，
	// 如  netscaipiao:// 所有客户端必须实现该方法，否则cmd命令无法使用
	getPrivateProto: function getPrivateProto() {
		return 'sportybet://';
	},
	/**
	 * @name  AppCore.caipiao.version
	 * @description 从UA中获取客户端版本，如果非客户端，则返回0
	 * @param  {boolean} [getMainVersion=false] 是否获取主版本号，默认获取build号
	 * @return {number}  彩票App版本号
	 * @function
	 * @example
	 * var build = AppCore.caipiao.version();
	 * //build = 4300;
	 */
	version: function version(getMainVersion) {
		// 框架提供的辅助对象
		var version = 0;
		var build = 0;
		// sportybetclient/sportybet/ke/1.1/2 channel/channelname deviceId/XXXXX
		if (/(?:sportybet)\/[^/]+\/([^/]+)\/(\d+)/.test(Helper.ua)) {
			version = RegExp.$1;
			build = +RegExp.$2;
		}
		return getMainVersion ? version : build;
	},
	/**
	 * @name AppCore.caipiao.ready
	 * @description 彩票JS Bridge准备OK事件挂接
	 * @param {function} fn 绑定的ready事件
	 * @function
	 */
	ready: function ready(fn) {
		if (window.AFJsApi) {
			return fn(window.AFJsApi);
		}
		var supportReady = Helper.checkBuild('sportybet', {
			ios: 1,
			android: 1
		});
		if (supportReady) {
			document.addEventListener('LDMJsBridgeReady', function () {
				fn(window.AFJsApi);
			});
		} else {
			Helper.ready(function () { return fn(window.AFJsApi); });
		}
	},

	// 简易url参数处理工具，仅内部使用
	_rmUrlPara: function _rmUrlPara(url, paraArr) {
		url = url.replace(/#.+$/, '');
		paraArr.forEach(function (key) {
			url = url.replace(new RegExp('(\\?|&)' + key + '=[^&|$]*', 'gi'), '$1');
		});
		return url.replace(/\?&/, '?').replace(/&{1,}/g, '&').replace(/&$/, '');
	}
});

// 彩票App登录模块
function shortCmd(url) {
	// backUri中在低版本中，不支持 #
	// 去掉可能重复的参数token和udid
	url = AppCore$2.sportybet._rmUrlPara(url, ['token', 'udid', 'sessionId', 'username']);
	AppCore$2.sendCmd('sportybet://login?backUri=' + encodeURIComponent(url));
}

Apps.reg('sportybet', {
	login: function login(okUrl, cancelUrl, success, fail) {
		AppCore$2.sportybet.ready(function (jsapi) {
			// 以防万一，做一下兼容处理
			if (!jsapi || !jsapi.account || !jsapi.account.login) {
				return shortCmd(okUrl);
			}
			// 第一个参数给未来配置功能预留
			jsapi.account.login({}, function (ret) {
				var data = typeof ret === 'string' ? JSON.parse(ret) : ret;
				switch (data) {
				case 'OK': // ret 返回值
				case 'success':
				case 'sucess':
					window.loginStatus = true; // 未刷新页面，手动设置登录状态
					success();
					break;
				default:
					fail();
				}
			});
		});
	}
});

// 彩票APP分享模块
var supportShare = Helper.checkBuild('sportybet', {
	android: 50
});
var getShareObj;
var shareCallback;

function send(share) {
		// 删除url中登录模块自动添加的参数
	var url = AppCore$2.sportybet._rmUrlPara(share.link || share.linkUrl || share.url, ['token', 'udid', 'sessionId', 'username']);
	var uri = encodeURIComponent;
	var appCmd = ['sportybet://share',
		'?',
		'&linkUrl=' + uri(url),
		'&jsCallback=afShareCb',
		'&logo=' + uri(share.img),
		'&title=' + uri(share.title),
		'&content=' + uri(share.desc || share.title || ' ')
	];

	share.quote && appCmd.push('&quote=' + uri(share.quote));
	share.hashtag && appCmd.push('&hashtag=' + uri(share.hashtag));
	share.hideCopy && appCmd.push('&hideCopy=' + uri(share.hideCopy));
	AppCore$2.sendCmd(appCmd.join(''));
}

Apps.reg('sportybet', {
	share: function share(getObj, cb) {
		getShareObj = getObj;
		shareCallback = cb;
		window.Methods = window.Methods || {};
		window.Methods.afShareCb = function(res) {
			var ret = 'error',
				type = 'unknown';
			if (/^(?:sharetype=)*(.+):(cancel|fail|ok)/i.test(res + '')) {
				ret = RegExp.$2;
				type = RegExp.$1;
			}
			cb(ret, type);
		};
	},
	shareNow: function shareNow() {
		var share = getShareObj();
		AppCore$2.sportybet.ready(function (jsapi) {
			// 以防万一，做一下兼容处理
			if (!jsapi || !jsapi.share || !jsapi.share.share || !supportShare) {
				return send(share);
			}
			var type = null;
			jsapi.share.share(share, function (ret) {
				ret = ret.replace(/^['"](.+)['"]$/, '$1');
				shareCallback(ret, type, ret);
			});
		});
	}
});

/**
 * @name AppCore.sportybetwap
 * @description 通用WAP控制方法集合
 * @namespace
 */
Apps.reg('sportybetwap', {
	is: function is () {
		return /www\.sportybet\.com/.test(location.host.toLowerCase());
	}
});

/**
 * 先跳转rrz中间登录页
 */
Apps.reg('sportybetwap', {
	login: function login(okUrl, cancelUrl, success, fail) {
		if (window.login) {
			// 因为login中带注册所以没法有回调函数
			return window.login.show(success, fail);
		}
		var loginUrl = (window.location.protocol) + "//" + (location.host) + "/" + (window.window.country) + "/m/registration";
		fail('jump');
		// 跳转页面
		window.location.replace([loginUrl + '?okUrl=', encodeURIComponent(okUrl)
		].join(''));
	}
});

__$styleInject(".sportybetwap-share-wrap {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 333;\n}\n\n.sportybetwap-share-mask {\n\twidth: 100%;\n\theight: 100%;\n\tbackground: rgba(0, 0, 0, 0.5);\n}\n\n.sportybetwap-share {\n    position: absolute;\n    z-index: 2;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    border-radius: 1.67rem 1.67rem 0 0;\n\tbackground: #fff;\n\theight: 15.75rem;\n}\n\n.sportybetwap-share-title {\n\tmargin: 0.92rem 1.33rem;\n\t-webkit-box-sizing: border-box;\n\t        box-sizing: border-box;\n\ttext-align: center;\n\toverflow: hidden;\n\theight: auto;\n\tposition: relative;\n}\n\n.sportybetwap-share-title .text-title {\n\tline-height: 2.67rem;\n\tfont-size: 1.33rem;\n\tfont-weight: 500;\n\tcolor: #353A45;\n}\n\n.sportybetwap-share-title .icon-close {\n\tdisplay: block;\n\tposition: absolute;\n\tright: 0;\n\ttop: 0;\n\tcolor: #9ca0ab;\n\tcursor: pointer;\n\twidth: 1.33rem;\n\theight: 1.33rem;\n\tpadding: 0.33rem;\n\tbackground: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhklEQVRYR82XTUvDQBCG3xGtB/+UF6Eq4smcrbS/qoV4jl6kFHoS/5MI6sGRTdl28zHJzLIx5hiWeZ+d7yWM/NHI+mgALPOncyI+m99nm5Rwq8fimpk+FrO7t9BuBWCZFxcArYmYwLidz7JtCohVXkxBeGEmBjANIfYAO3FsiOhkJ8rfKSC8OECT0irjK4TYA9QPpoBos1kCMF8tHrJXp1EJQUoIjXgDwP1IASHZ4B9c+pv73GotQ4uBepJaLyD2Aa0LQwCreGsI+gzWk8ifjxHvBZByog4RK64C6IMgwsQ1GV/n1vJVzwLhlp8AjmLF1R7ojnOYNfbuqfZACMFEawKOqyVoFzd7QG5U8bPD5IH2PPijEIiNyQ0UwukBwxYKlQe66rwUHrIMNU1Gc0ZabDo9YDEcO8BMw6hvS4oZYKZxrFnRrBANAIvbpbhaIP7PSpbi5prtSFxKD28C31RsDUUbDnEtdwbcqwjAdpSHib/BYE+z/PmGwe+dTzPJjUP+V82CIQF+AWccnTDp6vOiAAAAAElFTkSuQmCC) no-repeat center;\n\tbackground-size: 1.33rem 1.33rem;\n}\n\n.sportybetwap-share-list {\n\tpadding: 3.08rem 1.67rem 0;\n\ttext-align: center;\n\tdisplay: -webkit-box;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-webkit-box-align: center;\n\t    -ms-flex-align: center;\n\t        align-items: center;\n\t-ms-flex-pack: distribute;\n\t    justify-content: space-around;\n}\n\n.sportybetwap-share-list > a {\n\tdisplay: block;\n\ttext-decoration: none;\n}\n\n.sportybetwap-share-list .share-item-desc {\n\tline-height: 1.17rem;\n\tfont-size: 1rem;\n\ttext-align: center;\n\tcolor: #353A45;\n\tdisplay: block;\n}\n\n.sportybetwap-share-list .share-item-icon {\n\twidth: 3rem;\n\theight: 3rem;\n\tmargin: 0 auto 0.5rem;\n\tbackground-repeat: no-repeat;\n\tbackground-position: center;\n\tbackground-size: cover;\n}\n\n#shareLink_facebook .share-item-icon {\n\tbackground-image: url(data:image/png;base64,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);\n}\n#shareLink_whatsapp .share-item-icon {\n\tbackground-image: url(data:image/png;base64,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);\n}\n#shareLink_twitter .share-item-icon {\n\tbackground-image: url(data:image/png;base64,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);\n}\n", {});

/**
 * sportbet wap分享， 包括 facebook, twitter, whatsapp
 * 1. 可传参数
 * @param  {String} text 					[分享文案]
 * @param  {String} shareUrl/url/href/link  [分享地址]
 * @param  {String} hashtag 				[话题，如：#SportyBet]
 * @param  {String} quote 					[facebook 分享配置参数]
 * @param  {String} via 					[twitter 分享配置参数]
 * @param  {String} shareContent 			[whatsapp 分享配置参数]
 *
 * callback类型
 * @param  {String} ok 					[分享成功：fb sdk分享成功回调，其他无效]
 * @param  {String} fail  				[分享失败：whatsapp 分享失败回调]
 * @param  {String} cancel 				[取消分享：fb sdk取消分享回调，其他无效]
 * @param  {String} close  				[关闭分享弹窗]
 *
 * 2. facebook, twitter, whatsapp 所需参数如下：
 *  facebook: {
		href: '', // 分享地址 shareUrl是别名
		hashtag: '', // 分享的hashtag必须以#开头，如果不写，系统自动补全，如：#SportyBet
		quote: '' // 在分享中添加一段文案，注意一旦开启，将无法展示大图
	},
	twitter: {
		text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
		via: '', // 增加一个@xxx的在分享中,并且会弹出是否follow这个用户 如sportybet
		hashtag: '', // 增加一个hashtag，不需要以#号开始
		url: '' // shareUrl, url, href是别名
	},
	whatsapp: {
		text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
		url: '', // shareUrl, url是别名 分享url
		shareContent: '', // 分享文案， 如果提供了shareContent text和href就无效
	}
 *
 */


// 私有变量
var uri = encodeURIComponent;
var decode = decodeURIComponent;
var getShareObj$1;
var shareCallback$1;

// 生成query字符串
var getQueryString = function (keys, data) { return keys.reduce(function (str, key) {
	if (data[key]) {
		return str + "&" + key + "=" + (data[key]);
	}
	return str;
}, '').slice(1); };

/*
	isBlank: 是否在新页面打开
 */
var medias = [{
	name: 'facebook',
	label: 'Facebook',
	isBlank: false,
	url: '',
	click: function click(data) {
		var params = { href: data.url };
		var hashtag = data.hashtag;
		// 补#号
		if (hashtag) {
			hashtag = hashtag.indexOf('#') === 0 ? hashtag : ("#" + hashtag);
			params.hashtag = hashtag;
		}
		if (data.quote) {
			params.quote = data.quote;
		}

		if (window.FB) {
			var options = Object.assign({
				method: 'share',
				display: 'popup'
			}, params);
			window.FB.ui(options, function (response) {
				if (response) {
					shareCallback$1({ type: 'ok' });
				} else {
					shareCallback$1({ type: 'cancel' });
				}
			});
		} else {
			if (params.hashtag) {
				params.hashtag = uri(params.hashtag);
			}

			var keys = ['href', 'quote', 'hashtag', 'client_id', 'sdk'];
			var query = getQueryString(keys, Object.assign({
				client_id: 746045042245360,
				sdk: 'joey'
			}, params));
			window.open(("https://www.facebook.com/v2.11/dialog/share?" + query));
		}
	}
}, {
	name: 'whatsapp',
	label: 'Whatsapp',
	isBlank: false,
	url: function url(data) {
		var text = data.text;
		var shareContent = data.shareContent;
		var url = decode(data.url);
		var defaultShareContent = text ? ((decode(text)) + " at:" + url) : ("" + url);
		var shares = encodeURI(shareContent || defaultShareContent);
		return ("whatsapp://send?text=" + shares);
	},
	click: function click() {
		var loc = location.href;
		setTimeout(function () {
			if (location.href === loc && !document.hidden) {
				return shareCallback$1({
					type: 'fail',
					msg: 'WhatsApp might not be installed on your phone, install it and try agian.'
				});
			}
			shareCallback$1({ type: 'close' });
		}, 2000);
	}
}, {
	name: 'twitter',
	label: 'Twitter',
	isBlank: true,
	url: function url(data) {
		var options = Object.assign({}, data);
		if (options.hashtag) {
			options.hashtags = options.hashtag.replace(/^#/, '');
		}
		var keys = ['text', 'via', 'hashtags', 'url'];
		var params = getQueryString(keys, options);
		return ("http://twitter.com/intent/tweet?" + params);
	}
}];

var html = "\n\t<div class=\"sportybetwap-share-wrap\" id=\"sportybetwapShareWrap\">\n\t\t<div class=\"sportybetwap-share-mask\"></div>\n\t\t<div class=\"sportybetwap-share\">\n\t\t\t<div class=\"sportybetwap-share-title\">\n\t\t\t\t<span class=\"text-title\">Share</span>\n\t\t\t\t<i class=\"icon-close\" id=\"sportybetwapShareClose\"></i>\n\t\t\t</div>\n\t\t\t<div class=\"sportybetwap-share-list\">{0}</div>\n\t\t</div>\n\t</div>\n";

// 删除对话框
function removeDialog() {
	Helper.remove('#sportybetwapShareWrap');
}

function resolveShareParams(options) {
	// text, url, quote, hashtag, via, shareContent
	var text = options.get('text') || options.get('shareText') || '';
	var url = options.get('shareUrl') || options.get('url') || options.get('href') || options.get('link') || '';
	var quote = options.get('quote') || '';
	var hashtag = options.get('hashtag') || options.get('hashtags') || '';
	if (hashtag) {
		hashtag = hashtag.replace(/^#/, '');
	}
	var via = options.get('via') || '';
	var shareContent = options.get('shareContent') || '';

	// callback
	var close = function () {
		options.close && options.close();
		return removeDialog();
	};

	return {
		text: uri(text),
		url: uri(url),

		quote: uri(quote),
		hashtag: uri(hashtag),
		via: uri(via),
		shareContent: uri(shareContent),
		close: close
	};
}

Apps.reg('sportybetwap', {
	share: function share(getObj, cb) {
		getShareObj$1 = function() {
			var obj = getObj();
			return resolveShareParams(obj);
		};
		shareCallback$1 = function(res) {
			// cancel|fail|ok|close
			if (res.type !== 'cancel') {
				removeDialog();
			}
			cb(res.type, res.msg, res.type);
		};
	},
	shareNow: function shareNow() {
		if (!getShareObj$1) {
			throw new Error('请先调用AppCore.share({title: null, desc: null, link: null, img: null})，获取分享对象');
		}
		var obj = getShareObj$1();

		var content = [];
		// 先删除已有的分享弹窗
		removeDialog();
		// 拼接分享按钮
		medias.forEach(function (conf) {
			var url = Helper.isFunction(conf.url) ? conf.url(obj) : Helper.format(conf.url, obj);
			var mediaHtml = "\n\t\t\t\t<a class=\"share-item\" id=\"shareLink_" + (conf.name) + "\" data-action=\"" + url + "\" " + (conf.isBlank ? 'target="_share"' : '') + ">\n\t\t\t\t\t<div class=\"share-item-icon\"></div>\n\t\t\t\t\t<span class=\"share-item-desc\">" + (conf.label) + "</span>\n\t\t\t\t</a>\n\t\t\t";
			content.push(mediaHtml);
		});
		// 插入到页面，并初始化事件
		var htmlStr = Helper.format(html, content.join(''));
		Helper.prepend(document.body, htmlStr);
		// 点击触发分享
		var shareItems = document.querySelectorAll('.sportybetwap-share-list .share-item');
		if (shareItems) {
			shareItems.forEach(function (item, i) { return item.addEventListener('click', function (e) {
				e.preventDefault();
				var ref = item.dataset;
				var action = ref.action;
				var media = medias[i];

				if (action) {
					if (media.isBlank) {
						window.open(action);
						removeDialog();
					} else {
						location.href = action;
					}
				}

				media.click && media.click(obj, shareCallback$1);
				return false;
			}, false); });
		}

		var doms = document.querySelectorAll('#sportybetwapShareClose');
		if (doms) {
			doms.forEach(function (dom) { return dom.addEventListener('click', function () {
				shareCallback$1({ type: 'close' });
			}, false); });
		}
	}
});

module.exports = AppCore$2;
