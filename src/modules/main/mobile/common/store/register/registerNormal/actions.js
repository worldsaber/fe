import md5 from 'blueimp-md5';

export default {
	register ({ commit }, { phone, password }) {
		return new Promise((resolve, reject) => {
			fetch('/patron/account', {
				method: 'POST',
				body: {
					phone,
					password: md5(password)
				}
			})
			.then(res => res.json())
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			});
		});
	},

	registerWithVerifyCode ({ commit, state }, options = {}) {
		const { phone, password, type = 1, phoneVerifyCode } = options;
		return new Promise((resolve, reject) => {
			fetch('/patron/account/create', {
				method: 'POST',
				body: {
					phone,
					password,
					token: state.token || null,
					type,
					phoneVerifyCode
				}
			}).then(res => res.json()).then(data => {
				const code = data.bizCode,
					originData = data.data;

				const errorType = getErrorInfo(code);
				(!errorType || errorType !== 'phone') && commit(mutationTypes.UPDATE_ACCOUNT, params.phone);

				commit(mutationTypes.SAVE_TOKEN, originData);

				if (code === 10000) {
					// 写入cookie
					cookie('phone', state.account || '', {
						path: '/',
						expires: 365
					});

					dispatch('setReferralCode').then(() => {
						commit(mutationTypes.UPDATE_NEXT_PAGE, 'success');
						resolve(data);
					});
				} else {
					const errorMsg = data.message || defaultError;
					if ([11600, 11602, 11605].includes(code)) {
						const homePath = `${protocol}//${domain}${baseUrl}`,
							loginPath = `${homePath}independent_login?okUrl=${encodeURIComponent(homePath)}`;
						commit(mutationTypes.HNADLE_ERROR, {
							isPhoneError: errorType === 'phone',
							msg: `${errorMsg} Please try to <a href="${loginPath}" class="t-highlight">Log In</a>`
						});
					} else if (code === 11810) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'toast' : 'inline_toast',
							msg: 'Please check your internet connection and try again.'
						});
					} else if (code === 19999) {
						commit(mutationTypes.HNADLE_ERROR, {
							type: window === top ? 'toast' : 'inline_toast',
							msg: 'Sorry，something went wrong. Please try again later.'
						});
					} else {
						commit(mutationTypes.HNADLE_ERROR, {
							msg: errorMsg,
							isPhoneError: errorType === 'phone',
							isPsdError: errorType === 'psd',
							isCodeError: errorType === 'code'
						});
					}
					reject(data);
				}
			}).catch(err => {
				commit(mutationTypes.UPDATE_REQUSET_STATE, false);

				commit(mutationTypes.HNADLE_ERROR, {
					type: window === top ? 'toast' : 'inline_toast',
					msg: err.message || defaultError
				});

				reject(err);
			});
		});
	}
};
