// import { cookie } from 'storage';
import { getReferralCode } from 'utils/channel';
import { getMsgThreshold } from 'config/msgConfig';

const referralCode = getReferralCode();

const countryCode = window.countryCode || '254';
const remainCount = getMsgThreshold();

const state = {
	smsNumber: '741266782', 					// the number of sms center
	msgContent: 'SD23411', 						// the content of sms
	remainMsgNum: remainCount,							// the remian count
	account: '',				// 只存储验证通过的手机号码
	errorInfo: null,
	token: '',
	moduleName: 'index',
	countryCode: `+${countryCode}`,							// 国别码
	reqLoading: false,
	msgThreshold: remainCount,
	// promotionAd: null,
	referralCode
};
export default state;
