import { cookie } from 'storage';
import { getReferralCode } from 'utils/channel';
import { getMsgThreshold } from 'config/msgConfig';

const referralCode = getReferralCode();

const countryCode = window.countryCode || '254';
const remainCount = getMsgThreshold();

const state = {
	smsNumber: '741266782', 					// the number of sms center
	msgContent: 'SD23411', 						// the content of sms
	remainMsgNum: remainCount,							// the remian count
	account: cookie('phone') || '',
	errorInfo: null,
	moduleName: 'login',
	requesting: false,
	modulePath: ['login'],						// 页面跳转历史记录
	token: '',
	countryCode: `+${countryCode}`,							// 国别码
	phoneError: false,
	psdError: false,
	// tokenUnaviable: false,
	promotionAd: null,
	msgThreshold: remainCount,
	referralCode,
	sucCfg: ''
};
export default state;
