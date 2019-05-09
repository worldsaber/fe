import dialog from 'components/dialog';
import '../style/dialog.less';
import message from '../pagelet/message';

export default{
	components: {
		message
	},
	methods: {
    /*
    * 通用消息显示
    *  buttonList:[
      type: 'text'  // 这个值跟全局button的type一样  text,primary等
      txt: '按钮文字'
    ]
    */
		showMsgPop({ msg, buttonList, msgTitle }, callback) {
			const d = dialog({
				title: msgTitle || '&nbsp;',
				content: message,
				css: 'm-fm-dialog',
				width: 650,
				contentData: {
					msg: msg || '',
					// msgTitle: msgTitle || '',
					buttonList: buttonList || [{ type: 'primary', text: 'OK' }],
					btnClick: callback || (() => d.close())
				},
				button: []
			});
			return d;
		}
	}
};
