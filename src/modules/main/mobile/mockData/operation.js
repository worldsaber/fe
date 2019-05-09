// import mockjax from 'mock';

// // 注册
// mockjax.post('/patron/account', {
//     bizCode: 10000,
//     message: '测试内容12345',
//     data: {
//         token: '测试内容12345',
//         smsNumber: '测试内容12345',
//         msgContent: '测试内容12345',
//         remainMsgNum: 123456
//     }
// });

// // 短信验证码完成注册
// mockjax.post('/patron/account/0/complete', {
//     bizCode: 10000,
//     // bizCode: 11701,
//     message: '测试内容12345',
//     data: {
//         accessToken: '测试内容12345',
//         maxAge: 123456,
//         refreshToken: '测试内容12345'
//     }
// });

// // 验证短信完成注册
// mockjax.put('/patron/account/0/completeBySms', {
//     bizCode: 10000,
//     message: '测试内容12345',
//     data: {
//         token: '测试内容12345',
//         smsNumber: '测试内容12345',
//         msgContent: '测试内容12345',
//         remainMsgNum: 9999
//     }
// });

// mockjax.put('/patron/password/completeResetBySms', {
//     bizCode: 10000,
//     message: '测试内容12345',
//     data: {
//         token: '测试内容12345',
//         smsNumber: '测试内容12345',
//         msgContent: '测试内容12345',
//         remainMsgNum: 9999
//     }
// });

// // 获取手机验证码
// mockjax.post('/patron/verifyCode/sms', {
//     bizCode: 10000,
//     // bizCode: 11600,
//     message: '测试内容12345',
//     data: {
//         token: '测试内容12345',
//         smsNumber: '冰激凌!',
//         msgContent: '巧克力!',
//         remainMsgNum: 0
//     }
// });

// // 验证手机号码格式与状态
// mockjax.get('/patron/phone/checkStatus', {
//     bizCode: 10000,
//     // bizCode: 11600,
//     message: '测试内容12345',
//     data: {
//         token: '测试内容12345',
//         smsNumber: '测试内容12345',
//         msgContent: '测试内容12345',
//         remainMsgNum: 9999
//     }
// });

// // 重置密码
// mockjax.put('/patron/password/reset', {
//     bizCode: 10000,
//     data: {
//         accessToken: '测试内容12345',
//         maxAge: '测试内容12345',
//         refreshToken: '测试内容12345'
//     }
// });

// mockjax.put('/patron/password/completeReset', {
//     bizCode: 10000,
//     message: "测试内容12345",
//     data: {
//         token: "测试内容12345"
//     }
// })

// mockjax.post('/patron/accessToken', {
//     bizCode: 10000,
//     message: '测试内容12345',
//     data: {
//         accessToken: '测试内容12345',
//         maxAge: '测试内容12345',
//         refreshToken: '测试内容12345'
//     }
// });

// // 设置邀请码
// mockjax.post('/patron/account/inviteCode', {
//     bizCode: 10000,
//     message: '测试内容12345',
//     data: {
//         token: '测试内容12345',
//         smsNumber: '测试内容12345',
//         msgContent: '测试内容12345',
//         remainMsgNum: 9999
//     }
// });