import { actPath } from './config';

const countryCode = window.countryCode || '254';

const state = {
	/*
	国别码
	 */
	countryCode: `+${countryCode}`,

	/*
	首页答题状态
	1: 可猜结果
	2: 不可以猜结果
	 */
	homeStatus: -1,

	pageModule: 'home',

	/*
	首页使用的基本信息
	 */
	baseInfo: {
	},

	/*
	请求状态
	 */
	reqLoading: false,

	verifiedPhone: '',

	hasInit: false,

	sharedInfo: {},

	actConfig: actPath
};
export default state;
