import { cookie } from 'storage';
import { getMsgThreshold } from 'config/msgConfig';

const countryCode = window.countryCode || '254';
const remainCount = getMsgThreshold();

const state = {
	smsNumber: '741266782', 					// the number of sms center
	msgContent: 'SD23411', 						// the content of sms
	remainMsgNum: remainCount,							// the remian count
	account: cookie('phone') || '',
	errorInfo: null,
	moduleName: 'phone',
	requesting: false,
	countryCode: `+${countryCode}`,						// 国别码
	phoneError: false,
	psdError: false,
	msgThreshold: remainCount,
	// tokenUnaviable: false,						// 记录token是否失效
};
export default state;
