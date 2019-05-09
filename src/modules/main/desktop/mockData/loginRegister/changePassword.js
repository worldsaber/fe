import mockjax from 'mock';

/*
reset password
http://www.ke.sportybet.com/patron/phone/checkStatus
params: phone

10000
11000 The phone number shoud have 10 digits
11001 It is not Kenya's mobile number
11600 The phone number has already been registerd
11601 The mobile number has not been registered
11602 Phone No.was locked, pls contact our customer service
11605 Phone No.was freezed, pls contact our customer service
 */

mockjax.get('/patron/phone/checkStatus', {
	bizCode: 11601,
	message: '测试内容12345',
	data: {}
});

/*
verfiy reset code
http://www.ke.sportybet.com/patron/password/completeReset
token phoneVerificationCode

10000
11700 Incorrect code, pls try again；
11701 code out of date. Pls click button to send a new Code；// 没有申请过验证码的情况，也按照超时返回
11702 The code is already used
11810 invalid token
 */

mockjax.put('/patron/password/completeReset', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		token: '测试内容12345'
	}
});

/*
reset password of new password
http://www.ke.sportybet.com/patron/password/reset
token password

10000
11810 invalid token
 */

mockjax.put('/patron/password/reset', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		accessToken: '测试内容12345',
		maxAge: 123456,
		refreshToken: '测试内容12345'
	}
});

/*
verify sms
/patron/password/completeResetBySms
params: tiken
return:
10000
11800 did not receive SMS text message
11810 invalid token
 */
mockjax.put('/patron/password/completeResetBySms', {
	bizCode: 11800,
	message: '测试内容12345',
	data: {
		token: '测试内容12345'
	}
});
