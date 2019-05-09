import { userCenterUrl } from 'config/mycenter/dataConfig.js';

/**
 * 字段说明：
 * verifyType	作为表单提交的type值，以便复用某些弹窗内容，如 otp, 不要随意更改此值
 */
export const statusToDialog = { // eslint-disable-line
	10: {
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Pending Request'
			},
			content: 'Your deposit request has been submitted. It is now waiting for confirmation. You can check the deposit records in a short while.',
			button: ['OK']
		},
		addEvent: dialog => {
			dialog && dialog.onBtnClick(btn => {
				if (btn === 1) {
					window.location.href = userCenterUrl.transaction;
				}
			});
		}
	},
	72: {
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Pending Request'
			},
			content: 'Your deposit request has been submitted. It is now waiting for confirmation. You can check the deposit records in a short while.',
			button: ['OK']
		},
		addEvent: dialog => {
			dialog && dialog.onBtnClick(btn => {
				if (btn === 1) {
					window.location.href = userCenterUrl.transaction;
				}
			});
		}
	},
	// holding
	11: {
		type: 'holding',
		title: null,
		verifyType: 11,
		component: true,
		button: []
	},
	30: {
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Failed to Deposit'
			},
			content: 'We are unable to accept your payment at this time. Please check your payment information and try again later.', // 优先使用后台错误信息
			button: ['OK']
		}
		// addEvent: dialog => {
		// 	dialog && dialog.onBtnClick(btn => {
		// 		if (btn === 1) {
		// 			window.location.href = userCenterUrl.transaction;
		// 		}
		// 	});
		// }
	},
	83: {
		type: 'pin',
		title: 'Enter Card PIN',
		css: 'show-close',
		component: true
	},
	84: {
		type: 'otpSpecial',
		title: '',
		verifyType: 4,
		css: 'show-close',
		component: true
	},
	85: {
		type: 'phone',
		title: 'Enroll Phone',
		css: 'show-close',
		component: true
	},
	86: {
		type: 'birth',
		title: 'One Time Setup',
		css: 'show-close',
		component: true
	},
	87: {
		css: 'deposit-bank-auth',
		type: 'jumpBank',
		title: null,
		component: true
	},
	// need second otp
	88: {
		type: 'otpSpecial',
		title: '',
		verifyType: 8,
		css: 'show-close',
		component: true
	},
	89: {
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Something Wrong'
			},
			content: 'Sorry, your payment request has a problem. Please try using a different card or a card from a different bank. Thank you.',
			button: ['OK']
		}
	},
	// need dial otp
	76: {
		type: 'otpSpecial',
		title: '',
		verifyType: 9,
		css: 'show-close',
		component: true
	},

	77: {
		type: 'ussd',
		title: null,
		verifyType: 12,
		css: 'show-close m-pop--ussd',
		component: true
	}
};
