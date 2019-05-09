import dialog from 'components/dialog';
import message from '../pagelet/message';

export default{
	components: {
		message
	},
	methods: {
    /*
    * 通用消息显示
    */
		showMsgPop({ msg, buttonList, msgTitle, className = '' }, callback) {
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
		},
		showToast(msg) {
			dialog.toast(msg, 2000);
		},
		showLoading (content) {
			return dialog({
				title: null,
				css: 'es-dialog-toast',
				content,
				button: [],
				timeout: 0,
				animate: 0
			});
		}
	}
};
