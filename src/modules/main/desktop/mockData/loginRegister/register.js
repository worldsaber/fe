import mockjax from 'mock';

/*
regiter:
params: phoneCountryCode & phone & password
return :
10000 success
11000 The phone number shoud have 10 digits
11001 It is not Kenya's mobile number
11600 The phone number has already been registerd；
11602 Phone No.was locked/freezed, pls contact our customer service；
11703 the mobile number has exceeded the maximum number（此状态客户端展示后台返回的文案）
 */

mockjax.post('/patron/account', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		token: '测试内容12345',
		smsNumber: '12345678',
		msgContent: '测试短信内容12345',
		remainMsgNum: 2
	}
});

/*
verify code
http://www.ke.sportybet.com/patron/account/{accountId}/complete
param: token phoneVerifyCode

10000 success
11700 Incorrect code, pls try again；
11701 code out of date. Pls click button to send a new Code；// 没有申请过验证码的情况，也按照超时返回
11702 The code is already used
11810 invalid token
 */

mockjax.put(/\/patron\/accoun\/*\/complete/, {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		accessToken: '测试内容12345',
		maxAge: 123456,
		refreshToken: '测试内容12345'
	}
});

/*
send sms to register
http://www.ke.sportybet.com/patron/account/{accountId}/completeBySms
params: token
return:
10000 success
11800 did not receive SMS text message
11810 invalid token
 */
mockjax.put(/\/patron\/account\/*\/completeBySms/, {
	bizCode: 11800,
	message: '测试内容12345',
	data: {
		accessToken: '测试内容12345',
		maxAge: 123456,
		refreshToken: '测试内容12345'
	}
});
