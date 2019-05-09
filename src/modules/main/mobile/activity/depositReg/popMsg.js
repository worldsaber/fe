import dialog from 'components/dialog';
import message from './components/message';
/*
* 通用消息显示
*/
export function showMsgPop({ msg, buttonList, msgTitle, className = '' }, callback) {
	const d = dialog({
		// title: msgTitle || '',
		content: message,
		css: 'm-fm-dialog' + (className ? ' ' + className : ''),
		width: '78%',
		// animate: 6,
		contentData: {
			msg: msg || '',
			msgTitle: msgTitle || '',
		},
		button: buttonList || ['OK']
	}).onBtnClick(callback);
	return d;
}

export function showToast(msg) {
	dialog.toast(msg, 2000);
}

export function showLoading (content) {
	return dialog({
		title: null,
		css: 'es-dialog-toast',
		content,
		button: [],
		timeout: 0,
		animate: 0
	});
}
export default {
	showMsgPop,
	showToast,
	showLoading,
};

