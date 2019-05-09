import dialog from 'components/dialog';
import message from './giftPop';
/**
 * @param {*} param  包含字段{amount, giftAmount, giftType}
 */
export default function showGiftPop(param = {}) {
	const pop = dialog({
		title: '&nbsp;',
		content: message,
		css: 'm-fm-dialog',
		width: '78%',
		contentData: param,
		button: ['*OK']
	}).onBtnClick(() => {
		pop.close();
	});
}
