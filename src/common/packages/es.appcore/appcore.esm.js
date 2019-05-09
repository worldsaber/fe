/*!
 * appcore.js v1.5.9
 * (c) 2014-2018 jianxcao,chaoma
 * Released under the MIT License.
 */
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
 * @name AppCore.weixin
 * @description 微信控制方法集合
 * @namespace
 */
Apps.reg('weixin', {
	is: function is(ua, os) {
		return ua.indexOf('micromessenger') >= 0;
	},
	// 微信内部发送启动命令不能成功， 只能显示弹层
	// sendCmd : function(cmd, type){
	// },
	/**
	 * @name  AppCore.weixin.version
	 * @description 从UA中获取客户端版本，如果非客户端，则返回undefined
	 * @return {number}  微信App版本号
	 * @function
	 */
	version: function version() {
		// micromessenger/6.0.2.57_r966533.520
		if (/micromessenger\/(\d+)\.([\d.]+)/.test(AppCore$2.helper.ua)) {
			var main = RegExp.$1,
				sub = RegExp.$2.replace(/\./g, '');
			return +(main + '.' + sub);
		}
	},
	ready: function ready(fn) {
		if (window.WeixinJSBridge) {
			return fn(window.WeixinJSBridge);
		}
		document.addEventListener('WeixinJSBridgeReady', function () {
			fn(window.WeixinJSBridge);
		}, false);
	}
});
// 给非163域名或特殊需求开通sdk模式
// https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
(function(host) {
	var site =
		// 立马理财
		/(?:^|\.)lmlc\.com$/.test(host) ? {
			appId: 'wx0ede307c6e5e41ca',
			sign: 'https://app.lmlc.com/api/activity/weixin_sign?url={url}&callback={callback}'
		} :
		// 保险（为了使用其他一些功能）
		// /(?:^|\.)baoxian\.163\.com$/.test(host) ? {
		// 	appId: "wxa7eed22d3996f7b7"
		// } :
		// 天天爱彩票
		/(?:^|\.)ttacp8\.com$/.test(host) ? {
			appId: "wxf7caeb40e3f1c42e",
			sign: "https://wap.ttacp8.com/activity/newInvitePerson/getSignJsonByUrl.html?url={url}&callback={callback}"
		} :
		// 人人爱彩票
		/(?:^|\.)rracp8\.com$/.test(host) ? {
			appId: "wx668363a592fb30db",
			sign: "https://wap.ttacp8.com/activity/newInvitePerson/getSignJsonByUrl.html?url={url}&callback={callback}"
		} :
		// ai足球
		/(?:^|\.)aifootball365\.com$/.test(host) ? {
			appId: "wxb63c6859d6cf996f",
			sign: "https://activity.aifootball365.com/getSign/weixin.html?url={url}&callback={callback}"
		} :
		null;
	if (!site) {
		return;
	}
	// 并发缓冲
	var loading = false;
	var cache = [];
	var runCache = function() {
		var n = cache.length,
			i = 0;
		for (; i < n; i++) {
			cache[i](window.wx);
		}
		cache.length = 0;
	};
	Apps.reg('weixin', {
		ready: function ready(fn) {
			var wx = window.wx;
			if (wx && wx.__is_ready) {
				return fn(wx);
			}
			if (wx && wx.ready) {
				return wx.ready(function () {
					fn(wx);
				});
			}
			cache.push(fn);
			if (loading) {
				return;
			}
			loading = true;
			// 先获取签名，再加载
			(function(next) {
				if (!site.sign) {
					return next({});
				}
				var cb = 'cb' + +new Date();
				window[cb] = function(data) {
					window[cb] = null;
					next(data);
				};
				Helper.loadJS(Helper.format(site.sign, {
					url: encodeURIComponent(document.URL.split('#')[0]),
					callback: cb
				}));
			}(function (data) {
				(window.require || function(jsArr, callback) {
					Helper.loadJS(jsArr[0], function () {
						callback(window.wx);
					});
				})(['//res.wx.qq.com/open/js/jweixin-1.0.0.js'], function (wx) {
					if (window.wx = wx) {
						wx.config({
							// debug: true,
							appId: site.appId, // 必填，公众号的唯一标识
							timestamp: data.timestamp,
							nonceStr: data.nonceStr,
							signature: data.signature,
							jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo']
						});
						wx.ready(function () {
							wx.__is_ready = true;
						});
						wx.ready(runCache);
					} else {
						runCache();
					}
				});
			}));
		}
	});
}(location.host));

/**
 * @name AppCore.yixin
 * @description 易信控制方法集合
 * @namespace
 */
Apps.reg('yixin', {
	is: function is(ua, os) {
		return ua.indexOf('yixin') >= 0;
	},
	ready: function ready(fn) {
		if (window.YixinJSBridge) {
			return fn(window.YixinJSBridge);
		}
		document.addEventListener('YixinJSBridgeReady', function () {
			fn(window.YixinJSBridge);
		}, false);
	}
});

/**
 * @name AppCore.newsapp
 * @description 新闻客户端控制方法集合
 * @namespace
 */
Apps.reg('newsapp', {
	is: function is(ua, os) {
		return ua.indexOf('newsapp') > 0;
	},
	/**
	 * @name  AppCore.newsapp.version
	 * @description 从UA中获取客户端版本，如果非客户端，则返回undefined
	 * @return {number}  客户端版本号
	 * @function
	 */
	version: function version() {
		var version;
		var ua = Helper.ua;
		if (/newsapp\/(\d+)\.(\d*)/.test(ua)) {
			version = +(RegExp.$1 + '.' + RegExp.$2);
		}
		return version;
	}
});

/**
 * @name AppCore.wap
 * @description 通用WAP控制方法集合
 * @namespace
 */
Apps.reg('wap', {
	is: function is (ua, os) {
		// 通用wap处理
		return true;
	}
});

/**
 * AppCore之微信分享模块
 *
 * 旧版的获取分享状态及设置分享内容的JS接口一直用于内部业务，并未对外开放，
 * 在微信公开的开放文档里面并没有此接口。某些第三方借助微信客户端漏洞在未
 * 获得权限的情况下使用接口，微信6.0.2版本对此漏洞做了修复以确保用户分享内
 * 容的准确性，避免诱导分享。另外，此接口不久将会公布开放规则向公众号开放。
 *
 * 2015-03-16 只要验证公众号，并设置安全域名后，jsbridge可以重新使用。但是
 * 在使用上会受到微信的管制，所以，要尽量“合理”使用分享功能
 *
 * 2015-05-28 偶尔发现jsbridge有时会不生效，但是同样的组件在3g.163.com以及
 * new.163.com下一直有效。后来不知道为什么又生效了。估计微信有一套比较复杂
 * 的jsbridge控制策略。尝试挂钩子的方法无果（一旦原函数遭修改，即无效）
 * https://raw.githubusercontent.com/zxlie/WeixinApi/master/WeixinApi.js
 *
 */
(function() {
	// 对旧版本的jsbridge进行api包装
	var getWrapApi = (function() {
		var wrapAPI;
		return function(jsapi) {
			if (wrapAPI) {
				return wrapAPI;
			}
			// 旧版接口没有config接口
			if (jsapi.config) {
				return jsapi;
			}
			// 包装旧版接口
			var getHandler = function(menuAction, invokeName) {
				var ops;
				jsapi.on(menuAction, function (argv) {
					jsapi.invoke(invokeName, ops, function (res) {
						var ret = 'error';
						if (/^(?:.+):(cancel|fail|ok)/.test(res.err_msg)) {
							ret = RegExp.$1;
						}
						if (ret === 'ok') {
							ops.success();
						} else {
							ops.cancel();
						}
					});
				});
				return function(_ops) {
					_ops.img_url = _ops.imgUrl;
					ops = _ops;
				};
			};
			var qqhandler = getHandler('menu:share:qq', 'shareQQ');
			return wrapAPI = {
				showOptionMenu: function showOptionMenu() {
					jsapi.call('showOptionMenu');
				},
				hideOptionMenu: function hideOptionMenu() {
					jsapi.call('hideOptionMenu');
				},
				onMenuShareTimeline: getHandler('menu:share:timeline', 'shareTimeline'),
				onMenuShareAppMessage: getHandler('menu:share:appmessage', 'sendAppMessage'),
				onMenuShareQQ: qqhandler,
				onMenuShareQZone: qqhandler,
				onMenuShareWeibo: function onMenuShareWeibo() {}
			};
		};
	}());
	// 按照jssdk方式调用组件
	var getShareObj;
	var shareCallback;
	var bindJSListener = function() {
		AppCore$2.weixin.ready(function (wxjs) {
			if (!wxjs) { return; }
			var wx = getWrapApi(wxjs),
				share = getShareObj();
			// 微信朋友圈
			wx.onMenuShareTimeline({
				title: share.get('wxtTitle', 'wxTitle', 'imTitle', 'title'),
				link: share.get('wxtLink', 'wxLink', 'imLink', 'link'),
				imgUrl: share.get('wxtImg', 'wxImg', 'imImg', 'img'),
				// 朋友圈没有描述字段
				desc: share.get('wxtDesc', 'wxDesc', 'imDesc', 'desc'),
				success: function success() {
					shareCallback('ok', 'timeline');
				},
				cancel: function cancel() {
					shareCallback('cancel', 'timeline');
				}
			});
			// 微信好友
			wx.onMenuShareAppMessage({
				title: share.get('wxTitle', 'imTitle', 'title'),
				link: share.get('wxLink', 'imLink', 'link'),
				imgUrl: share.get('wxImg', 'imImg', 'img'),
				desc: share.get('wxDesc', 'imDesc', 'desc'),
				success: function success() {
					shareCallback('ok', 'appmessage');
				},
				cancel: function cancel() {
					shareCallback('cancel', 'appmessage');
				}
			});
			// 分享到QQ以及QQ空间
			var qqconf = {
				title: share.get('qqTitle', 'imTitle', 'title'),
				link: share.get('qqLink', 'imLink', 'link'),
				imgUrl: share.get('qqImg', 'imImg', 'img'),
				desc: share.get('qqDesc', 'imDesc', 'desc'),
				success: function success() {
					shareCallback('ok', 'qq');
				},
				cancel: function cancel() {
					shareCallback('cancel', 'qq');
				}
			};
			wx.onMenuShareQQ(qqconf);
			wx.onMenuShareQZone(qqconf);
			// 分享到腾讯微博
			wx.onMenuShareWeibo({
				title: share.get('wbTitle', 'imTitle', 'title'),
				link: share.get('wbLink', 'imLink', 'link'),
				imgUrl: share.get('wbImg', 'imImg', 'img'),
				desc: share.get('wbDesc', 'imDesc', 'desc'),
				success: function success() {
					shareCallback('ok', 'weibo');
				},
				cancel: function cancel() {
					shareCallback('cancel', 'weibo');
				}
			});
		});
		// 提前加载资源
		Helper.preloadLayout();
	};
	Apps.reg('weixin', {
		share: function share(getObj, cb) {
			getShareObj = getObj;
			shareCallback = cb;
			bindJSListener();
		},
		shareNow: function shareNow(e) {
			AppCore$2.helper.showLayout('weixin');
		}
	});
	// 增加私有接口：显示右上角分享菜单
	Apps.reg(true, 'weixin', {
		showOptionMenu: function showOptionMenu() {
			AppCore$2.weixin.ready(function (wxjs) {
				getWrapApi(wxjs).showOptionMenu();
			});
		},
		hideOptionMenu: function hideOptionMenu() {
			AppCore$2.weixin.ready(function (wxjs) {
				getWrapApi(wxjs).hideOptionMenu();
			});
		}
	});
}());

/**
 * AppCore之易信分享模块
 */
var getShareObj;
var shareCallback;
var updateShareInfo = function() {
		var share = getShareObj();
		window.shareData = {
			imgUrl: share.img,
			// 分享给好友
			fTitle: share.get('wxTitle', 'imTitle', 'title'),
			fImgUrl: share.get('wxImg', 'imImg', 'img'),
			sendFriendLink: share.get('wxLink', 'imLink', 'link'),
			fContent: share.get('wxDesc', 'imDesc', 'desc'),
			// 分享到朋友圈
			tTitle: share.get('wxtTitle', 'wxTitle', 'imTitle', 'title'),
			tImgUrl: share.get('wxtImg', 'wxImg', 'imImg', 'img'),
			timeLineLink: share.get('wxtLink', 'wxLink', 'imLink', 'link'),
			tContent: share.get('wxtDesc', 'wxDesc', 'imDesc', 'desc'),
			// 分享到微博
			wImgUrl: share.get('wbImg', 'img'),
			weiboLink: share.get('wbLink', 'link'),
			wContent: share.get('wbDesc', 'desc')
		};
	};
var bindJS = function() {
		var callback = function() {
			var arg = [], len = arguments.length;
			while ( len-- ) arg[ len ] = arguments[ len ];

			return shareCallback.apply(this, arg);
		};
		// 2015-05-29 马超 测试安卓的易信分享没有触发回调通知
		AppCore$2.yixin.ready(function (YixinJSBridge) {
			if (!YixinJSBridge) { return; }
			YixinJSBridge.on('menu:share:timeline', function () {
				var share = getShareObj();
				AppCore$2.helper.hideLayout();
				YixinJSBridge.invoke('shareTimeline', { // 分享到朋友圈
					title: share.get('yxtTitle', 'yxTitle', 'imTitle', 'title'),
					link: share.get('yxtLink', 'yxLink', 'imLink', 'link'),
					desc: share.get('yxtDesc', 'yxDesc', 'imDesc', 'desc'),
					img_url: share.get('yxtImg', 'yxImg', 'imImg', 'img')
				}, callback);
			});
			YixinJSBridge.on('menu:share:appmessage', function () {
				var share = getShareObj();
				AppCore$2.helper.hideLayout();
				YixinJSBridge.invoke('sendAppMessage', { // 分享给好友
					title: share.get('yxTitle', 'imTitle', 'title'),
					link: share.get('yxLink', 'imLink', 'link'),
					desc: share.get('yxDesc', 'imDesc', 'desc'),
					img_url: share.get('yxImg', 'imImg', 'img')
				}, callback);
			});
		});
		// 提前加载资源
		AppCore$2.helper.preloadLayout();
		// 仅仅绑定一次，防止重复绑定易信导致的崩溃或问题
		bindJS = function() {};
	};
Apps.reg('yixin', {
	share: function share(getObj, cb) {
		getShareObj = getObj;
		shareCallback = function(res) {
			var ret = 'error';
			if (/^(?:.+):(cancel|fail|ok)/.test(res.err_msg)) {
				ret = RegExp.$1;
			}
			cb(ret, res.err_msg);
		};
		updateShareInfo();
		bindJS();
	},
	shareNow: function shareNow(e) {
		updateShareInfo();
		AppCore$2.helper.showLayout('yixin');
	}
});

Apps.reg(true, 'yixin', {
	updateShareInfo: updateShareInfo
});

/**
 * AppCore之新闻客户端分享模块
 */
var supportShare = AppCore$2.newsapp.version() >= 3.9;

var getShareObj$1 = function() {};
var safeHTML = function(str, light) {
	var s = str.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
	// 属性包裹用的引号不能转义
	return light ? s.replace(/=&quot;(.*?)&quot;/g, '="$1"')
	.replace(/=&#39;(.*?)&#39;/g, '=\'$1\'') : s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

var updateShareInfo$1 = function() {
	// 插入隐藏的节点
	var share = getShareObj$1();
	if (!share) {
		return;
	}
	Helper.remove('#__newsShareInfo');
	Helper.prepend(document.body, '<div style=\'display:none\' id=\'__newsShareInfo\'></div>');
	document.querySelector('#__newsShareInfo').innerHTML = [
		'<div id=\'__newsapp_sharetext\'>//分享:' + safeHTML(share.desc) + ' ' + share.link + '</div>',
		'<div id=\'__newsapp_sharephotourl\'>' + share.img + '</div>',
		'<div id=\'__newsapp_sharewxtitle\'>' + safeHTML(share.get('wxtTitle', 'wxTitle', 'imTitle', 'title')) + '</div>',
		'<div id=\'__newsapp_sharewxtext\'>' + safeHTML(share.get('wxtDesc', 'wxDesc', 'imDesc', 'desc')) + '</div>',
		'<div id=\'__newsapp_sharewxurl\'>' + share.get('wxtLink', 'wxLink', 'imLink', 'link') + '</div>',
		'<div id=\'__newsapp_sharewxthumburl\'>' + share.get('wxtImg', 'wxImg', 'imImg', 'img') + '</div>'
	].join('');
};

Apps.reg('newsapp', {
	share: function share(getObj, cb) {
		getShareObj$1 = getObj;
		Helper.ready(updateShareInfo$1);
		window.__newsapp_share_done = function(res) {
			// 客户端返回的通知数据有误，暂不可用
			cb('ok');
		};
	},
	shareNow: function shareNow(e) {
		if (!supportShare) {
			AppCore$2.helper.showLayout('newsapp');
			return;
		}
		updateShareInfo$1();
		AppCore$2.sendCmd('share://');
	}
});

Apps.reg(true, 'newsapp', {
	updateShareInfo: updateShareInfo$1
});

// 2015-05-26 马超 增加对 __newsapp_sharetext 的检测，防止新闻客户端不引入分享功能
Helper.ready(function () {
	var dom = document.querySelector('#__newsapp_sharetext');
	if (dom) {
		Helper.prepend(document.body, '<div style=\'display:none\' id=\'__newsShareInfo\'><div id=\'__newsapp_sharetext\'>' + safeHTML(document.title) + ' ' + document.URL + '</div></div>');
	}
});

__$styleInject("/*\n * wap通用分享弹层\n */\n\n#wapShareWrap {\n\tposition: fixed;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n\tz-index: 9999;\n}\n#wapShareWrap a{\n\tcolor: #8e8e8e;\n\t-webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n\ttext-decoration: none;\n}\n.wapShareLayout {\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n\tbackground: rgba(0, 0, 0, .5);\n\tz-index: 1;\n}\n.wapShareDialog {\n\tposition: absolute;\n\tleft: 0;\n\tbottom: 0;\n\twidth: 100%;\n\theight: auto;\n\tz-index: 2;\n\tbackground: rgba(255, 255, 255, 0.95);\n\tpadding: 1rem 0 0;\n}\n.top .wapShareDialog{\n\tbottom: auto;\n\ttop: 0;\n}\n.wapShareDialog h1{\n\tfont-size: 1.25rem;\n\tdisplay: block;\n\ttext-align: center;\n\tcolor: #3c3e45;\n\tpadding-bottom: 1rem;\n}\n.wapShareDialog section{\n\tdisplay: block;\n\twidth: 92%;\n\tmargin: auto;\n}\n.wapShareDialog .wapShareLink {\n\tdisplay: inline-block;\n\twidth: 25%;\n\tmin-width: 5rem;\n\ttext-align: center;\n\tpadding: 4rem 0 1rem;\n\tbackground-repeat: no-repeat;\n\tbackground-position: 50% 0;\n\tfont-size: 1rem;\n\tbackground-size: auto 3.2rem;\n}\n#wapShareClose{\n\tdisplay: block;\n\theight: 3.75rem;\n\tline-height: 3.75rem;\n\ttext-align: center;\n\tborder-top: 1px solid #e6e6e6;\n\tfont-size: 1.25rem;\n}\n#wapShareClose:active{\n\tbackground-color: #e7e7e7;\n}\n#wapShareLink_yixin{\n\tbackground-image: url(data:image/png;base64,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);\n}\n#wapShareLink_sina{\n\tbackground-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAACW1BMVEX////7pI/7oo38uqr8v7D7rJn7ppH/9fP6g2f4akj4Z0T6k3r4bEv+8u/91Mr+3tf8t6b/9/X7ppL92M/91s36iW77nIX6knn6lX37nIb6h2z8v7H+8/H91cz6mIH+8Oz7noj9zMD92tL8tqX7pZD6jnX8sJ76h2v6j3X6jXP8w7X8vq/9y7/6kXj+8O37oIv8vK3+7+v7n4n4ZEH7nYf9yLv8wLH7qJT6lHv6im/6hWn6i3D9yLz8xLf6j3b9x7r8va75fmH+5+L6jnT90cf7oYv90MX8s6H5elz4ZkP92tH6mID+8e78sZ/8u6z+6+f+4Nn5dFT/+Pb90sf9zMH929P5dVX7oYz9x7v4bEr8sqD/9PL90sj9z8T5elv+39j7sJ7/9PH93dX+5d/7o478uan4aEX5dVb8xrn4Z0X+8/D5bk35fF75gWT/9vT/+ff+4tz6jHH+7en+7Oj5bUv8u6v91Mv7rZv8wLL7m4T6iG37p5P5dlf7rpv5fV/+6OP+6uX5eFn//v75gmb5fmD7rZr+7Of//Pv5dFX9zcH5gGP6mYH8uqv+5uD+49393NT8xbf6hmv6ln79187+4tv5cVH7moP7q5j7qpf91cv5gWX7m4X6hGj5eVv5eVr4aEb9zcL+7ur4ZUL5f2L6mYL+6+b8tKP8wbP/+fj7qZX5cFD+5uH6hmr8taT7qZb6i3H5b077rpz//fz5bUz5clL4a0n5d1j8uKj8wrT4Y0D9yr7//v35gmX6k3v4Yz/4aUf+39f+6eT4Yj7+5N7+4dr//f3/+/r////4YT3xgHgwAAAAAXRSTlMAQObYZgAABYVJREFUeNrFmeVj2zgUwHXMzIxjuu1GN4aDMe+GXbuuXVfcurYrMzMzrrxykrZJ03QNS3/WyY7tOLbkxIHb+1LrPelXR5bee3oCwKs4bAdyh6d6dato8N2ckqnh9AM2BwhY7KOzq0gmq7Oj9kColohFRJXFCIt/VO3hKStSFOu+B1rVWGfGIvJBFjOcqrDLhnnko8wbln3nmquQCqky+4gt71hCqmRpptwX7ogJqZauEe/cgQXkhywMeONqrMg/0Sjv3m7kt3Qr7HPnCgpAVqhL2rEXBSR7ae/chgKUNjK3FAUs7SSu0Ro42GqUc2v7URCkv1a2IEpQUKREujRmUJDkmSc3/HmwwM89fN1yFwqaJIr985i6sambC1LqOtN29hGtY27ueKs68F+Qkz8PEayt4wI4WuWvfQ0K8kmP3KwXltqESvAGKJIomXmCX3INqj/Q7LbqHRE/XXjIkn+VmRs4sC+xaI4UWOKnWXKHVG9ycR95pWaN5TsvdZKCQBb70jFS9SMW/MwLtjCMm83Nbt3vK693szlCCWMII2+/f5W5N93faY2wvexM034aP3YwT3OSMRUMt0UR22QTLYAnwgtzirX42UKaZSYXnVbi/iJeWDBS0Oe1fV6zHWtmEcrGf5ql46YxOFkhxfnbgwszPKwnsfUUjqHYUCcdmYwj6Co935v05DJT2bXHGFmQ33w2h+nwLdT2oy5ssMgycwe4R+VO3JVwJ3s2FfDPRS/jHochzENzWgifygbbwHUa9+hjCRd+5NEqRsgA4VF08haEW2Wjr4NcCveOEyqLAVnxiklFsUmkNy4F1WRufJIXLvwQzUMYjtDFIsIco2rQSF4PFm9cOIQGf9wTj9AaSHrjRkCJAp4Qx+MnBv10tPFn9/c8xnctxg29DNAHdCRutZhqyza18slMbOH3t1nl3Vj319ifKCfoAClP0Ymw7x+X/cpmrH4jLSpBacuuApL2toDlEtvF9W1b8kSxx2U0X1Mgg0G5rljg3mO/QLvLEVlGhR4HOftl+jEIpMp1HwhBmEljtrg39uQffJdwTtNyn5bEEbzxFM+pZFoGj+WxjY9URZziOwpYB/Jkut+4Me8xjVzJ6q3gOnXyihNkcB/IkunquSFpzDGLH9/8dTT7dyPXaS1veIkMXgd2ynS8B2Mm9DQ/vtcVKuAZLnvM5g3/kMFfEQII97FuMQgjfhh/pemaXY+G4lj1RVenGh5McWLTYECmu+waYWdjF4RJbH0hrszt7Bnhm7CJDK4EtXKP5xrBOparELqyAzvH4fxYsvA1KelZLXDckOpiuCGFrhWSyejWS6Z0hG9fJXNv4CPfO7Qd3Y4fP4OwDPtHIW+Fb7E9vhHax8ngL3CUPifP08bZMVvfxucrZu3ZfxA469gOZ4W2kbI/zmGwTa7ezzkZ/DjYItodccVsGrRRUDyleQobkwpVyPUfc56AmeZX3YkQ67sP5bv/Uw+FW0FNCo9wkYM5pc3r6y4VPbxwZB9jGLoi+gWZymcyYho7yjvOjjtuZUJUswh7ZgPVZ7YoJN4JRh6w3VxZo7l5sNPumWiU0lMok/JRoSlFIUZ/2qgQPRq8HG6WdtRTsMZZpXgnHG6AntrnzU3SxBAu12t6lVN1vW8HyBNtNZ2RtvyylPPH6k6FTX/ptTgpOkCqPfIqy5j4kJ4YPG6VRxHVHKKyQhALITPS0o0pOFyTrKp3fiEY3AVCWbYyGOWxK6TCW3uICnoADAfKHaYVTVcC4644/u8yLwDaAArTmdoXUUoPYfE/dNcVAJTPhOaChfF1Q2q4Q+YXf4nFLOndOb5gY3Y7Vd/oaR/0eFt6PX5cFLquNjVKV5saP682Q3kZy18f70pnro/xIfS+rndqOH2XL9fH/wFyKlK0GWXAXAAAAABJRU5ErkJggg==);\n}\n#wapShareLink_qqzone{\n\tbackground-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAACK1BMVEX////8vwT////8wxT912L+78H//v3//vz//fn8vwX8whH8wAf8yCb8xyP9zDj//vr//fb+9NT93n/+8sz8xBj//vv9zDb9zj7/99/91l78xh78wQr901T8xR393Hf/9df/9t3+67D+89D+56L+5p38whD93Hb+88/93nz93Xr+89L+45L+4Yj+4Yr901P+6aj90Ef9zj38wAj//ff//fj93n3+5p/8ySr8wxX8wAb9zDf9yzH8ySn9yjD8wg7/+uv+6KT+6KX+5JT8xiD///78wQ3912P/+en+6qv+4o/91l3/+OT9zDX+5Zr912H+5Zv90Ur93n79zj//+u391FX+66/8xyL8xBn91mD/9tz//PT/+OP9z0L8xyT+5pz+78L+67H+4Yn+45P+7Lb923D/9+D8yCf934D91Fb8wxP8wxL9zTz/++7+7r3+6af92Wr9zTv8wg/93HX+56H+7rv8xh/+45H91l/+4If934H/+/D+9NX/9Nb+6Kb9z0T90Ej8yCX+8cf9zkD+6q79yzL+89H+8s3+8s79yzT+34P93Xj9z0P//PL+5Jb92Gb/+ur+45D90Eb92m38wQz+7LT923L+5Zn91Vr8xBf/9+H+7LP9zTr+8MT/+/H91Vv//PP+77/8xiH+4Yv+34L92GT8wAn901L8wQv8xRr90k3+7bj92Wv/++/+7bf+8sv+6ar901H+8MP+4o7+5JX8yCj8xRv8xBb/+ef91VlJa8DCAAAAAXRSTlMAQObYZgAABHtJREFUeNrFmfdDFEcUx2cG3SueHFzxOA44qiCIiICANAtIl2bvXRN7i733kljTo4mmRxN74p+X3Ttub+ubt7d3yfen25l5n9sy8+bNe4Rw5citGwuHmgNuGvn7Qlso3FSX6yC2VTl7rpvq5J47u9IOtfikh5rKc7I4NWpwUchFQbnqFwYtY50bPRQhz0anJawwfwlFasl8Ac/1D1ELGvIjsd5b86glzSvyYrh52dSyFuTxuSVZNAVllfC4PhdNTT549S6jKWsZsM6dBdSGCkyntGM5taXlZvd8nNrUcWNuFbWtWUbcPpd9sKtPz41W0DSoIqrlNrbRtKitUQMuomnSTDX32rR0gaepfJ2wAGMzg/2IGaX0z+Wom+ljpzAeqjzJzcnHcHcKjN1EjMvPkcH3UDf8BWNsbQAxsF/2PYUY7vsGEcxqESMLE96oDHXDJyQuW/sbYmjZJBi1F1WcioFZDWJsdpxbjbrhw3Eua8C8t+oYeCaGGxmcBLOt6OU3HQNemuAy70r+6OkS9yrKH0ZlMBtGjC8VwVsw4FdJLvMiHnGLCD6P4LZWK8BsEd/gvLiDuhHgKUylGVwDt4OcQXB7BtXgH/gmueSsQbyk1S6m0W7NAD3jLBnTNx5hFuXXM6rIgMFzPHmsNPvnu6l6bRKSA+p69IgBMm44wUuV5IbKI4dHj6k3oDK5t7vKKG4YJ+2G7/6jfbrn3Tv10wOhj+Pdnd/IzTm7DQHtxMRzR14av841V6S/3SRfd9Ub2weIWZzSutWIO3Fb7FqVfFFr3plNZAIEYnruGemMtqFYvr64ytSaRID15tBwt0mvuCO5Wi53mhuTr4Dl83uOitsvRTUH98rXnwBRTgXsjQ92KZzaT1LLqPxfwnbIMkA6wCV/TubejU34L71ywwnQsJ2sB/tHE5jc2JM9V6y3xaDhJbIUtSM9ijlXn/KNH4UdLYEjkElUbau0PdWoPuXXoGEtKQH7RySEc3Xs9/qLjUpwdw9kuIJEQfAfIqFXXrWRb7fX7ZDJVyDDKHG0gBsBY6Wa7b5wzrPXsTn3AbBrEY98cyDwCzbxYIpen739K8h2AXa/iLs0NG06oX0D2qwXi+DTQH8zBL4G7qVwiHVfRdrcMdytuLzDCbGgoFAZT6yTPkb9aUVLPicoBMLYJhki1MQDm5+rGuS2c6Z2V3mB93CCcT0Z/HiOJhoPcAJv4KiwLU74/nOV5x3onfTHvKOC+eEmvrltfqqd/uWx9j95hxvSbwbuSnw0nVeU4uU8E6s33APkw+RH04UHY41M+JV3gDQ78uYL180j1p37elt4R14i8CNefKpTlUT1ZyitkMZESJE2l5edHm62Lqu3Iysd3CyDtOyKdKTHLhsl3mZlKKFHSNguN2yWNC2wxy1w/NdpXkKCNhLTq4P/Ryo9g8n/zJUrCPEWZabAIvm6G1a4N/wZKWIds1LEkqb0yAUMdsOI03JFL7hwD2/q7UmhUBgvbfqg0qYvxdJmJouxifLx/iapfHyI0kOB5lC4aT+mfPwvQgWbFgeIkoMAAAAASUVORK5CYII=);\n}\n#wapShareLink_qqweibo{\n\tbackground-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAACSVBMVEX////G6/me3fVZxe5py+9tzPCK1vNOwe2V2vTq+P1myu9Nwe2P2PON1/Od3fVDvuzy+/5qy/B40PHp9/2Y2/TA6fiD1PIwt+phyO/K7PlszPDs+P3z+/625vfu+f3L7fql4Pbt+f2w4/eB0/J50fH1/P7O7vrn9/xSw+3A6floyu/f9Pzx+v6C0/I2ueoxt+qn4fZYxe5LwexfyO+p4fZPwu3D6vmk3/Zfx+7M7frR7/qb3PVIv+yZ3PTN7vrP7vqc3PVrzPCT2vRex+7Y8ftgyO+h3vVlyu+G1fLy+v665/jl9vwutumq4fZdx+45uuuW2vSc3fVxzvB70fFvzfDv+f2o4fZ0z/Hb8/tRw+2g3vXK7fqv4/dnyu+f3vU3ueqi3/XH7PmE1PKI1vO35viH1fOj3/aU2vTr+P150PGJ1vOA0/Istun0+/7I7Pl1z/GQ2PTX8fvg9Pzh9fyz5ffF6/n2/P5axu6a3PVTw+3B6vkzuOq45vjc8/t30PFFvuxbxu5cxu6X2/Q+vOu96PiR2fREvuzk9vz4/f605fdLwOyt4/f5/f5kye8vt+pUxO160fH7/v+75/g6u+vJ7Pk4uuqy5PdKwOzd8/uw5PfE6vn+//92z/GO2PNAves/vOvi9fyL1/NWxO48u+vo9/3W8fu15fc7u+tBvevj9fw0uOr3/P6S2fTZ8vva8vtQwu0yuOpHv+xGv+xjye+r4vY3uuq86Pg1uepuzfBVxO39/v+M1/PU8Pv6/f4rtekttun8/v////8qtelL4ScSAAAAAXRSTlMAQObYZgAABTBJREFUaN7FmfVDG0kUx/fc3d3d7+ruvbZXl6tixUpxKBRtgRZ3J2hxJ4SQEN/v/GU3m2wg2Z0Nm91wfT8kO/Myn92dzJN5w3HrCj8//rDvfu2ElTSeNi3c73s4Ps9zumXs7pKVyMS6dHdMD3UoaZEoymLSkDYq35nvJiHFnd8Z/py4zItEhSyaXWFh7XWTRKVM1tnVc51NJAxpcqrEtjg8JCzxOFrUcKdsJGyxTa3PtSwTDbJsWY876ybaZDb02r1FNMutEGvatUJ0yIrikuZ1cSlZ6ZlLiU4pZXMziW7pZ3GL3frB7mI5t3uaRECmu6Xc+gUSEVmol4AdJELySOLPPJECe4J8nd1GIia2QP9sDn/8RJKzGqPxR+Ua8xp3ZiBs7r9pvKHcsekFbGmTqgZmVsFHQiFGbH/ZKqSdfyPdGxM9cTPzv0qVV1d9z6Digl/6MhmCfJF7NNB+Fvjj/n/7YH2ndNSg3xv1KHG3ZWFN5pbWFFveWjMnB2Qm0COCh9nYf2Iojjdknnv63MuFLnp9qdE/i70p9PNCdvJZ+tzGn2OkI4d93Dk211gI1J8dEVttZ2aAdqPoH2EipIun94qjreNjsrFzXvAjJje1lb59bUCHyQkYPOJfl0rIbWF+Wmnr1VEF87vH9oDAnujgV2gHyr1Xt0Fv0CCAP6etGDm4UuAeYudO9ciRxmtrCfjNwsUSqKW6x4GfhHX4Qbp8eBYF72SCa9D7lKzzex4W77PnJQpfBVM/CE9nT5EP30nBDSxuBY/xVQsp25zqt1b0eifuSPVLwlcCaC5WkzciH99AI6iVBY4DxEXYEd8LVN3wNZ4DvP41+sSQcANj8h43GX2XMd7KcyXMmbDghO+i0em1DrtoHSW44zO9T48lnKYeAzcVbGueq2H2TyGXiAvAJyX+ufjId/GaAXxW4XR8y0E2uIabZfbzOOO7eMdv0SZv8xXA7ySuHCgeNxaNffwHE5DJZTD74X/HvX6wL2X+BQhehCPzM/tZgAyuTOGJxTe5LnLtHd7ms8B7wb9su4ZERoAv47qY4FHU+SJYugh+4OtPxDGZr9rNj56XhcwuboIJNsDnmi6J3CrRZe/AdvmPC9oxKnU4E9y0kqcQ/q1SoLt0+8WcKDH+TPaK3kIihy1V0oXMsVfLn8CT1GGkIS1oqt4GrqgMilwjuz8WscRN3Vlz0NbrG+xVG225Nna/KWqBZACFQbnIHeCw2iROwRt7rfk7VJsCI+smoEd12sEpJ4NfAc8HNItygctWteAubpti6M/GxbUl416ZAoZUb4TJKe68koqGngN0Xi/8uGtg143dOXQxfzaiPlNq5vYpqT6Bi5px82pe8XpKOBnpPs6ioDHmoZh+vc+L6YojvB1rK9etoNkPvOF1Xw3NCc1LFeEmjd0c38HW/I7q37QnyR10y/cMWzUnBiFt8iGN0luZmuhe9OsAb6Xgy0xNGfCiDvC8kApVsjRfA4PauZXKSWE5ZnTvyZhp7HVk6wAfUk68LfhWO3c4xFYhFk9oB/eE2Nzs8MdlDbK6ueGuypXXdICjQm0gDWjXyg3YQDK2vA/g1Ao2h9ykmzGmkdtkD1lWOJV3MxJlhQgWQhzSWt5wZLjDsqpe1XIkuMuMsmxrJMpjrazCW79+cD+7VNinl9v3fxdNN6zMq68w/Sb/OErpG1j837jjio07YBF8XUE43ALn4z/EEpb0SZMarOmkK+wTPb4zfz2sloNC39HmbKijzVmNR5sbeRgbfHxcRPd6E7Vqj4//A66T1PmrgN97AAAAAElFTkSuQmCC);\n}\n#wapShareLink_renren{\n\tbackground-image: url(data:image/png;base64,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);\n}\n#wapShareLink_mail{\n\tbackground-image: url(data:image/png;base64,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);\n}\n#wapShareLink_sms{\n\tbackground-image: url(data:image/png;base64,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);\n}\n", {});

// 分享配置
var medias = [{
	name: 'yixin',
	cn: '易信',
	url: 'http://open.yixin.im/share?appKey=&type=webpage&title={yxTitle}&desc={yxDesc}&userdesc=&pic={yxImg}&url={yxLink}'
}, {
	name: 'sina',
	cn: '新浪微博',
	url: 'http://v.t.sina.com.cn/share/share.php?url={wbLink}&title={wbTitle}&searchPic=true&pic={wbImg}'
}, {
	name: 'qqzone',
	cn: 'QQ空间',
	url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={imLink}&desc={imDesc}&summary= &title={imTitle}&site={site}&otype=share&pics={imImg}'
}, {
	name: 'qqweibo',
	cn: '腾讯微博',
	url: 'http://share.v.t.qq.com/index.php?c=share&a=index&site={site}&url={wbLink}&title={wbTitle}&pic={wbImg}'
}, {
	name: 'renren',
	cn: '人人网',
	url: 'http://widget.renren.com/dialog/share?resourceUrl={url}&title={title}&description={desc}&charset=utf-8&pic={img}'
}, {
	name: 'mail',
	cn: '邮件',
	url: function url(data) {
		var body;
		var desc = data.mailDesc;
		switch (Helper.os) {
		case 'ios':
			body = encodeURIComponent(desc.replace(/&/g, '&amp;') + '   ' + data._url);
			break;
		default:
			body = encodeURIComponent(desc + ' ' + data._url);
			break;
		}
		return 'mailto:?subject=' + data.title + '&body=' + body;
	}
}, {
	name: 'sms',
	cn: '短信',
	url: function url(data) {
		// ios 和 pc 无法发送短信内容
		if (Helper.os === 'android') {
			var desc = data.smsDesc.substr(0, 140).replace(/\?/g, '？');
			return 'sms:?body=' + encodeURIComponent(desc + ' ' + data._url);
		}
	}
}];

// html代码，提供id，方便页面覆盖样式
var html = "\n\t<div id=\"wapShareWrap\">\n\t\t<div id=\"wapShareLayout\" class=\"wapShareLayout\"></div>\n\t\t<div id=\"wapShareDialog\" class=\"wapShareDialog\">\n\t\t<h1><span>分享到</span></h1>\n\t\t<section>{0}</section>\n\t\t<a id=\"wapShareClose\"><span>取消</span></a></div>\n\t</div>";

// 删除对话框
function removeDialog() {
	Helper.remove('#wapShareWrap');
}

// 私有变量
var uri = encodeURIComponent;

var getShareObj$2;
// 通用wap分享
Apps.reg('wap', {
	share: function share(getObj, cb) {
		var site = window.AppName || window.appName || window.appId || location.host;
		getShareObj$2 = function() {
			var obj = getObj();
			return {
				// 易信配置
				yxTitle: uri(obj.get('yxTitle', 'imTitle', 'title')),
				yxDesc: uri(obj.get('yxDesc', 'imDesc', 'desc')),
				yxImg: uri(obj.get('yxImg', 'imImg', 'img')),
				yxLink: uri(obj.get('yxLink', 'imLink', 'link')),
				// 微博配置
				wbLink: uri(obj.get('wbLink', 'imLink', 'link')),
				wbTitle: uri(obj.get('wbTitle', 'imTitle', 'title')),
				wbImg: uri(obj.get('wbImg', 'imImg', 'img')),
				// im类配置
				imTitle: uri(obj.get('imTitle', 'title')),
				imDesc: uri(obj.get('imDesc', 'desc')),
				imImg: uri(obj.get('imImg', 'img')),
				imLink: uri(obj.get('imLink', 'link')),
				// 通用配置
				site: uri(site),
				title: uri(obj.title),
				desc: uri(obj.desc),
				url: uri(obj.link),
				img: uri(obj.img),
				// 短信配置
				smsDesc: obj.get('smsDesc', 'desc'),
				// 邮件配置
				mailDesc: obj.get('mailDesc', 'desc'),
				// 其他未编码的数据
				_site: site,
				_title: obj.title,
				_desc: obj.desc,
				_url: obj.link,
				_img: obj.img
			};
		};
	},
	shareNow: function shareNow() {
		if (!getShareObj$2) {
			throw new Error('请先调用AppCore.share({title: null, desc: null, link: null, img: null})，获取分享对象');
		}
		var obj = getShareObj$2();
		var content = [];
		// 先删除已有的分享弹窗
		removeDialog();
		// 拼接分享按钮
		medias.forEach(function (conf) {
			var url = Helper.isFunction(conf.url) ? conf.url(obj) : Helper.format(conf.url, obj);
			var isHTTP = /^http/i.test(url);
			if (url) {
				content.push('<a class="wapShareLink"' + (isHTTP ? ' target="_share"' : '') +
				' id="wapShareLink_' + conf.name + '" href=\'' + url + '\'><span>' + conf.cn + '</span></a>');
			}
		});
		// 插入到页面，并初始化事件
		Helper.prepend(document.body, Helper.format(html, content.join('')));
		// 判断对话框位置，默认在底部，可以设置为顶部
		var dialogPos = obj.wapShareDialogPos || AppCore$2.wap.wapShareDialogPos;
		if (dialogPos === 'top') {
			Helper.addClass(document.body.querySelector('#wapShareWrap'), 'top');
		}
		var doms = document.querySelectorAll('#wapShareLayout,#wapShareClose,#wapShareDialog .wapShareLink');
		if (doms) {
			doms.forEach(function (dom) { return dom.addEventListener('click', removeDialog, false); });
		}
	}
});

// 易信登录模块
Apps.reg('yixin', {
	login: function login(okUrl, cancelUrl, success, fail) {
		// &url={1}&url2={2} target表示登录的类型
		var thirdLoginUrl = location.protocol + '//reg.163.com/outerLogin/oauth2/connect.do?target=9&product=caipiao&domains=caipiao.163.com&display=mobile';
		// okurl一定会有，已经做过处理
		// 失败处理地址--失败地址必须有
		cancelUrl = cancelUrl || okUrl;
		thirdLoginUrl += '&url=' + okUrl;
		thirdLoginUrl += '&url2=' + cancelUrl;
		fail('jump');
		window.location.replace(thirdLoginUrl);
	}
});

/**
 * AppCore之新闻客户端登录模块(含第三方登录支持)
 *
 * 新闻客户端接口说明：（协作群）前端技术分享/mobile/网易新闻客户端 内嵌webview 开发备忘.note
 */
Apps.reg('newsapp', {
	login: function login(okUrl, cancelUrl, success, fail) {
		// 登录成功后的回调
		window.__newsapp_login_done = function(info) {
			// info格式：
			// {name:"用户名",nickname:"昵称",head:"头像url",loginType:"netease"}
			success(info);
		};
		// 取消登录的回调
		window.__newsapp_login_canceled = function() {
			fail('cancel');
		};
		// 客户端需要页面ready之后才能调用登录状态查询命令
		Helper.ready(function () {
			// 优先强制用户使用网易通行证登录，问题最少
			AppCore$2.sendCmd('login://onlynetease');
		});
	}
});

// 导出appCore

// export { AppCore };

export default AppCore$2;
