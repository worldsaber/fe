# 用户注册

目前账号密码注册有两种方法：

1. 不要验证码注册
components: *** RegisterNormal ***

```
fetch('/patron/account', {
	method: 'POST',
	body: {
		phoneCountryCode: '', // 手机国家码
		phone: '',
		password: ''
	}
})
```

2. 需要验证码注册
components: *** RegisterVerify ***

```
fetch('/patron/account/create', {
	method: 'POST',
	body: {
		phoneCountryCode: '',
		phone: '',
		password: '',
		phoneVerifyCode: '', // 手机验证码
		token: '', // 验证码token
		type: '' // 注册类型：1-验证码，2-上行短信
	}
})
```

## 注意
1. 注册密码需要 md5
