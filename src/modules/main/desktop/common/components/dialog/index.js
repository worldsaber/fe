import 'packages/es.dialog/desktop/dialog.css';
import dialog from 'packages/es.dialog/desktop/dialog.esm.js';
import Vue from 'vue';
import './dialog.less';

export * from 'packages/es.dialog/desktop/dialog.esm.js';

const info = function (content, btn, callback, _defaultBtn, _defaultCss) {
	if (typeof btn === 'function') {
		callback = btn;
		btn = 0;
	}
	const button = btn || _defaultBtn || ['*OK'];
	return dialog({
		title: null,
		css: _defaultCss || 'es-dialog-info',
		content,
		dragable: 2,
		button
	}, callback);
};
dialog.alert = function alert (content, btn, callback) {
	return info(content, btn, callback, 0, 'es-dialog-alert');
};
dialog.confirm = function confirm (content, btn, callback) {
	return info(content, btn, callback, ['CANCEL', '*CONFIRM'], 'es-dialog-confirm');
};
dialog.error = function error (content, btn, callback) {
	return info(content, btn, callback, 0, 'es-dialog-error');
};
// 覆盖main中得toast
const toast = function (content, timeout, callback) {
	if (typeof timeout === 'function') {
		callback = timeout;
		timeout = 0;
	}
	return dialog({
		title: null,
		css: 'es-dialog-toast',
		content,
		button: [],
		timeout: timeout || 2500,
		animate: 0
	}, callback);
};
dialog.info = info;
dialog.toast = toast;

export { default } from 'packages/es.dialog/desktop/dialog.esm.js';
export {
	alert,
	confirm,
	toast,
	info,
};
export const conf = dialog.conf;

// 定义vue实例的 dialog方法，在实例中可以直接使用 $dialog
Object.defineProperties(Vue.prototype, {
	$dialog: {
		value: dialog,
		enumerable: true
	},
	$alert: {
		value: dialog.alert,
		enumerable: true
	},
	$confirm: {
		value: dialog.confirm,
		enumerable: true
	},
	$toast: {
		value (...arg) {
			return dialog.toast(...arg);
		},
		enumerable: true
	},
	$error: {
		value: dialog.error,
		enumerable: true
	}
});
