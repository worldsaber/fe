import { getReferralCode } from 'utils/channel';

const referralCode = getReferralCode();

const state = {
	smsNumber: '741266782', 			// the number of sms center
	msgContent: 'SD23411', 				// the content of sms
	remainMsgNum: 3,					// the remian count
	account: '',						// 只存储验证通过的手机号码
	token: '',
	referralCode,
	ignoreVcode: false					// 是否可以忽略验证码进行注册
};
export default state;
