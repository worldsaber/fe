/**
 * 处理充值完成后返回到来源页面的问题，如果无来源记录，则默认跳回到整站首页
 */

// 充值来源页url标记
const S_DEPOSIT_REFERRER = 's_deposit_referrer';

/**
 * 记录目标地址，用于在充值操作后跳转至目标地址
 * @param  {String} targetUrl 目标地址
 * @return {[type]}           [description]
 */
export const setRecord = (targetUrl = '') => {
	sessionStorage.setItem(S_DEPOSIT_REFERRER, targetUrl);
};

/**
 * 清除记录地址
 * @return {[type]} [description]
 */
export const removeRecord = () => {
	sessionStorage.removeItem(S_DEPOSIT_REFERRER);
};

/**
 * 获取目标地址
 * @return {String}           返回目标地址
 */
export const getRecord = () => {
	const record = sessionStorage.getItem(S_DEPOSIT_REFERRER);
	if (record) {
		removeRecord();
	}
	return record || '';
};

/**
 * 校验来源地址与记录是否在同一路径下，如果不是则清除记录
 * @return {[type]} [description]
 */
export const check = () => {
	const record = sessionStorage.getItem(S_DEPOSIT_REFERRER);
	if (document.referrer.indexOf(record) === -1) {
		removeRecord();
	}
};

export default {
	setRecord,
	removeRecord,
	getRecord,
	check
};
