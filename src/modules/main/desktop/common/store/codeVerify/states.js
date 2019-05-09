import { getMsgThreshold } from 'config/msgConfig';

const countryCode = window.countryCode || '254';
const remainCount = getMsgThreshold();

const state = {
	smsNumber: '741266782', 					// the number of sms center
	msgContent: 'SD23411', 						// the content of sms
	remainMsgNum: remainCount,							// the remian count
	errorInfo: null,
	reqLoading: false,
	countryCode: `+${countryCode}`,						// 国别码
	moduleName: '',
	msgThreshold: remainCount
};
export default state;
