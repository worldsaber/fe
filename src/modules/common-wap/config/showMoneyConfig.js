import { formatNumber } from 'utils';

/**
 * 判断目标数值是否需要显示浮点数
 * 金额显示规则如下：
	1. 若为整数，只显示整数不保留小数；
	2. 若为小数，保留两位小数（eg. 若为0.1，在该处显示0.10）
 */
export const isShowFloatMoney = num => /\./.test(String(num));

/**
 * 格式化金额数字, 目前主要是对所有的红包金额作处理
 * @param {Number, String} num 		目标数字
 * @param {Boolean} isSeparate  	是否显示千位分隔符
 */
export const formatMoneyShow = (num, isSeparate = true) => {
	const decimals = isShowFloatMoney(num) ? 2 : 0;

	if (isSeparate) {
		return formatNumber(num, decimals);
	}

	return Number(num).toFixed(decimals);
};

export default formatMoneyShow;
