import mockjax from 'mock';

/*
login
http://www.ke.sportybet.com/patron/accessToken
params: username（phone）& password

10000
11000 The phone number shoud have 10 digits
11001 It is not Kenya's mobile number
11002 incorrect country code
11010 The password should not be empty
11601 The mobile number has not been registered
11602 Phone No.was locked/freezed, pls contact our customer service
11603 Phone No. does not exist or Incorrect password，pls try again
 */
mockjax.post('/patron/accessToken', {
	bizCode: 10000,
	message: '测试内容12345',
	data: {
		accessToken: '测试内容12345',
		maxAge: 123456,
		refreshToken: '测试内容12345'
	}
});

/*
get code
http://www.ke.sportybet.com/patron/verifyCode/sms
params: phone & bizType
return: token & smsNumber & msgContent & remainMsgNum
10000 success
11600 The phone number has already been registerd；
11601 User not exist；
11602 Phone No.was locked/freezed, pls contact our customer service；
11703 the mobile number has exceeded the maximum number（此状态客户端展示后台返回的文案）
11704 Sending verify code is too frequent（有争议，暂不返回）
 */

mockjax.post('/patron/verifyCode/sms', {
	bizCode: 11703,
	message: '测试内容12345',
	data: {
		token: '测试内容12345',
		smsNumber: '测试内容12345',
		msgContent: '测试内容12345',
		remainMsgNum: 0
	}
});

mockjax.post('/patron/account/thirdParty', {
	bizCode: 123456,
	message: '测试内容12345',
	data: {
		accessToken: '测试内容12345',
		maxAge: 123456,
		refreshToken: '测试内容12345',
		token: '测试内容12345',
		phone: '测试内容12345'
	}
});
