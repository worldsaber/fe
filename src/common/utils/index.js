import URL from 'packages/fe.url';

const toStr = Object.prototype.toString;

export function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isVNode(node) {
	return typeof node === 'object' && hasOwn(node, 'componentOptions');
}

export function objType(obj) {
	const class2type = {};
	['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'].forEach(item => {
		class2type['[object ' + item + ']'] = item.toLowerCase();
	});

	return obj == null ? String(obj) :
      class2type[({}).toString.call(obj)] || 'object';
}

// 格式化数字：每3位添加一个，
export function formatNumber(number, decimals) {
	let tempReturn = '';
	number = parseFloat(number);

	if (typeof decimals === 'number') {
		number = number.toFixed(decimals);
	} /* else {
		number = number.toFixed();
	} */

	if (number) {
		tempReturn = (+number).toLocaleString('en');
		if (decimals) {
			tempReturn += tempReturn.indexOf('.') !== -1 ? '0000000000' : '.0000000000';
			tempReturn = tempReturn.slice(0, tempReturn.indexOf('.') + decimals + 1);
		}
		return tempReturn;
	}
}

// 检查是否支持history API
export const supportsPushState = (function() {
	const ua = window.navigator.userAgent;

	if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
		ua.indexOf('Mobile Safari') !== -1 &&
		ua.indexOf('Chrome') === -1 &&
		ua.indexOf('Windows Phone') === -1) {
		return false;
	}

	return window.history && 'pushState' in window.history;
})();

// 将object参数替换成  &符号链接的参数
export function params(obj) {
	const list = [];
	const buildParams = (prefix, obj) => {
		if (Array.isArray(obj)) {
			obj.forEach((v, i) => buildParams(prefix + '[' + (isPlainObject(v) ? i : '') + ']', v));
		} else if (isPlainObject(obj)) {
			Object.keys(obj).forEach(name => buildParams(prefix + '' + name + ']', obj[name]));
		} else {
			list.push(encodeURIComponent(prefix) + '=' + encodeURIComponent(obj == null ? '' : obj));
		}
	};
	Object.keys(obj).forEach(key => buildParams(key, obj[key]));
	return list.join('&').replace(/%20/g, '+');
}

export function isPlainObject (obj) {
	if (!obj || toStr.call(obj) !== '[object Object]' || obj.nodeType || obj === window) {
		return false;
	}
	// Not own constructor property must be Object
	if (obj.constructor &&
		!hasOwn(obj, 'constructor') &&
		!hasOwn(obj.constructor.prototype, 'isPrototypeOf')) {
		return false;
	}
	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	let key;
	for (key in obj) { } // eslint-disable-line
	return key === undefined || hasOwn(obj, key);
}

export function noop () {}

export function isEmptyObject(obj) {
	let key;
	for (key in obj) { // eslint-disable-line
		return false;
	}
	return true;
}

export function isFunction (fun) {
	return typeof fun === 'function';
}

export { URL };
