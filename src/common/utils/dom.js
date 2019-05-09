const eleProto = typeof Element !== 'undefined' ? Element.prototype : {};
const matchesPolyfill = eleProto.matches ||
eleProto.matchesSelector ||
eleProto.webkitMatchesSelector ||
eleProto.mozMatchesSelector ||
eleProto.msMatchesSelector ||
eleProto.oMatchesSelector;
// const types = {};
function isFunction (fun) {
	return typeof fun === 'function';
}

// 绑定事件的缓存
const EvtCache = {};
/**
 * 执行代理事件
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, type, selector, data, callback, one) {
	return function(e) {
		if (data) {
			e.data = data;
		}
		if (!selector) {
			callback.call(element, e);
		} else {
			e.delegateTarget = closest(e.target, selector, true);
			if (e.delegateTarget) {
				callback.call(e.delegateTarget, e);
			}
		}
		one && unBindEvt(element, type, selector, data, callback);
	};
}
/**
 * 简单事件代理
 * @param {element|string} element 元素或者css3选择器
 * @param {eventType} type 事件类型
 * @param {*} selector 选择器
 * @param {*} callback  回调函数
 */
function bindEvt (element, type, selector, data, callback, one = false) {
	if (element && element.nodeType === 1 && typeof type === 'string') {
		if (isFunction(selector)) {
			callback = selector;
			selector = null;
			data = null;
		}
		if (isFunction(data)) {
			callback = data;
			data = null;
		}
		if (typeof selector === 'object') {
			data = selector;
			selector = null;
		}
		if (!isFunction(callback)) {
			return;
		}
		const listenerFn = listener.call(this, element, type, selector, data, callback, one);
		if (!element.__cjx__event__id) {
			element.__cjx__event__id = +new Date();
		}
		const id = element.__cjx__event__id;
		EvtCache[id] = EvtCache[id] || [];
		EvtCache[id].push({
			callback,
			listenerFn,
			selector,
			data,
			type
		});
		element.addEventListener(type, listenerFn, false);
	}
}
/**
 * 简单事件代理解绑
 * @param {element|string} element 元素或者css3选择器
 * @param {eventType} type 事件类型
 * @param {*} selector 选择器
 * @param {*} callback  回调函数
 */
function unBindEvt(element, type, selector, callback) {
	if (element && element.__cjx__event__id && EvtCache[element.__cjx__event__id] && typeof type === 'string') {
		const caches = EvtCache[element.__cjx__event__id];
		if (isFunction(selector)) {
			callback = selector;
			selector = null;
		}
		caches.forEach((cache, index) => {
			if (cache.type !== type) {
				return;
			}
			if (typeof selector === 'string' && cache.selector !== selector) {
				return;
			}
			if (isFunction(callback) && cache.callback !== callback) {
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
}

// 处理传入的element，最后形成一个数组
function detailNode (element) {
	let res;
	if (!element) {
		return [];
	}
	if (element.nodeType === 1) {
		res = [element];
	} else if (typeof element === 'string') {
		res = document.querySelectorAll(element);
	} else if (element.length) {
		res = element;
		if (element instanceof NodeList) {
			res = Array.prototype.slice.call(element, 0);
		}
	}
	return res || [];
}

// ready
export function domReady(callback) {
	const readyReg = /complete|loaded|interactive/;

	if (readyReg.test(document.readyState) && document.body) {
		callback();
	} else {
		document.addEventListener('DOMContentLoaded', callback, false);
	}
}

/**
 * 根据给定元素查找该select是否匹配
 * @param {element|selector} el selector匹配元素只取第一个
 * @param {string} selector css3 选择器 将匹配其中任意一个
 */
export function	matches (el, selector) {
	if (!selector || typeof selector !== 'string') {
		return false;
	}
	if (typeof el === 'string') {
		el = document.querySelector(el);
	}
	if (!el || el.nodeType !== 1) {
		return false;
	}
	if (matchesPolyfill) {
		return matchesPolyfill.call(el, selector);
	}
	// 不支持原生的match，则修复下
	// 注意修复的性能比较低
	const nodes = el.parentNode.querySelectorAll(selector);
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i] === el) return true;
	}
	return false;
}
/**
 * 从父元素中找到一个和selector相匹配的元素
 * @param {element|string} element  注意只会取第一个元素哦
 * @param {*} selector css3选择器
 * @param {*} checkYoSelf 是否包括自己
 */
export function closest(element, selector, checkYoSelf, all = false) {
	const res = [];
	if (typeof element === 'string') {
		element = document.querySelector(element);
	}
	if (!element || !selector || typeof selector !== 'string') {
		return all ? res : undefined;
	}
	let parent = checkYoSelf ? element : element.parentNode;
	while (parent && parent !== document) {
		if (matches(parent, selector)) {
			if (all) {
				res.push(parent);
			} else {
				return parent;
			}
		}
		parent = parent.parentNode;
	}
	return all ? res : undefined;
}
/**
 * 简单事件代理
 * @param {element|string} element 元素或者css3选择器
 * @param {eventType} type 事件类型
 * @param {*} selector 选择器
 * @param {*} callback  回调函数
 */
export function	delegate (element, type, selector, data, callback) {
	detailNode(element).forEach(cur => bindEvt(cur, type, selector, data, callback));
}
export function once(element, type, selector, data, callback) {
	detailNode(element).forEach(cur => bindEvt(cur, type, selector, data, callback, true));
}
/**
 * 简单事件代理解绑
 * @param {element|string} element 元素或者css3选择器
 * @param {eventType} type 事件类型
 * @param {*} selector 选择器
 * @param {*} callback  回调函数
 */
export	function undelegate (element, type, selector, callback) {
	detailNode(element).forEach(cur => unBindEvt(cur, type, selector, callback));
}

export function triggerEvt (element, eventName) {
	let event; // The custom event that will be created
	let ele;
	if (!element) {
		return;
	}
	if (typeof element === 'string') {
		ele = document.querySelector(element);
	} else if (element.nodeType === 1) {
		ele = element;
	}
	if (!ele) {
		return;
	}
	if (document.createEvent) {
		event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = eventName;
	}
	event.eventName = eventName;
	if (document.createEvent) {
		ele.dispatchEvent(event);
	} else {
		ele.fireEvent('on' + event.eventType, event);
	}
}
/**
 * 向前插入内容
 * @param {element|selector} node 被插入的父节点
 * @param {element|dom string|NodeList} childNode  要插入的子节点
 */
export function prepend(node, childNode) {
	if (typeof node === 'string') {
		node = document.querySelector(node);
	}
	if (!childNode || (!typeof childNode !== 'string' && childNode.nodeType !== 1 && !childNode.length)) {
		return;
	}
	if (!node || node.nodeType !== 1) {
		return;
	}
	if (!node.childNodes.length) {
		return append(node, childNode);
	}
	if (typeof childNode === 'string') {
		const div = document.createElement('div');
		div.innerHTML = childNode;
		const fragment = document.createDocumentFragment();
		const nodes = Array.prototype.slice.call(div.childNodes, 0);
		nodes.forEach(node => {
			fragment.appendChild(node);
		});
		node.insertBefore(fragment, node.childNodes[0]);
	} else if (childNode) {
		if (childNode.nodeType) {
			node.insertBefore(childNode, node.childNodes[0]);
		} else if (childNode.length) {
			let nodes = childNode;
			if (childNode instanceof NodeList) {
				nodes = Array.prototype.slice.call(childNode, 0);
			}
			const fragment = document.createDocumentFragment();
			nodes.forEach(node => {
				if (node && node.nodeType) {
					fragment.appendChild(node);
				}
			});
			node.insertBefore(fragment, node.childNodes[0]);
		}
	}
}
/**
 * 向后插入内容
 * @param {element|selector} node 被插入的父节点
 * @param {element|selector} childNode 要插入的子节点
 */
export function append (node, childNode) {
	if (typeof node === 'string') {
		node = document.querySelector(node);
	}
	if (!childNode || (typeof childNode !== 'string' && childNode.nodeType !== 1 && !childNode.length)) {
		return;
	}
	if (!node || node.nodeType !== 1) {
		return;
	}
	if (typeof childNode === 'string') {
		const div = document.createElement('div');
		div.innerHTML = childNode;
		const fragment = document.createDocumentFragment();
		const nodes = Array.prototype.slice.call(div.childNodes, 0);
		nodes.forEach(node => {
			fragment.appendChild(node);
		});
		node.appendChild(fragment);
	} else if (childNode) {
		if (childNode.nodeType) {
			node.appendChild(childNode);
		} else if (childNode.length) {
			let nodes = childNode;
			if (childNode instanceof NodeList) {
				nodes = Array.prototype.slice.call(childNode, 0);
			}
			const fragment = document.createDocumentFragment();
			nodes.forEach(node => {
				if (node && node.nodeType) {
					fragment.appendChild(node);
				}
			});
			node.appendChild(fragment);
		}
	}
}

/**
 * 移除内容
 * @param {string|node|array[node]|NodeList} selectors  css3选择器
 */
export function remove (selector) {
	let doms;
	if (!selector) {
		return;
	}
	if (typeof selector === 'string') {
		doms = document.querySelectorAll(selector);
	} else if (selector.nodeType) {
		doms = [selector];
	} else if (selector.length) {
		doms = Array.prototype.slice.call(selector, 0);
	}
	if (doms) {
		doms.forEach(dom => {
			if (dom && dom.parentNode) {
				dom.parentNode.removeChild(dom);
			}
		});
	}
}

window.addEventListener('load', () => {
	// console.log(matches(document.querySelector('.m-header'), 'm-header,s-page-header'));
	// console.log(closest('.m-main-left', 'm-main1,.s-page__main'));

	// remove('span,em');
	// remove(document.body);
	// remove('.m-main-left,.m-header');

	// prepend('body', 'test');
	// prepend(document.body, 'test');
	// let div = document.createElement('div');
	// prepend(document.body, div);
	// prepend(div, 'cjx');
	// prepend(document.body, document.querySelectorAll('header,footer'));

	// append('body', 'test');
	// append(document.body, 'test');
	// let div = document.createElement('div');
	// append(document.body, div);
	// append(div, 'cjx');
	// append(document.body, document.querySelectorAll('header,footer'));

	// delegate(document.body, 'click', 'test', function (e) {
	// 	console.log(e, this);
	// });

	// delegate(document.body, 'click', 'div', { test: 1111 }, function (e) {
	// 	console.log(e, this);
	// });
	// console.log(closest('.m-main-left', 'div', false, true));
});
