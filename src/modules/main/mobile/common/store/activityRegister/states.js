// import { cookie } from 'storage';
import { getReferralCode } from 'utils/channel';

const referralCode = getReferralCode();

const countryCode = window.countryCode || '254';

const state = {
	smsNumber: '741266782', 					// the number of sms center
	msgContent: 'SD23411', 						// the content of sms
	remainMsgNum: 3,							// the remian count
	account: '',				// 只存储验证通过的手机号码
	errorInfo: null,
	token: '',
	moduleName: 'index',
	countryCode: `+${countryCode}`,							// 国别码
	reqLoading: false,
	// promotionAd: null,
	referralCode,
	ignoreVcode: false,
	marketData: null,
	eventId: '',
	id: '',
	odds: '',
	marketId: '',
	betStatus: '',
	potentialWin: 0,
	pickedDesc: '',
	orderId: ''
};
export default state;
