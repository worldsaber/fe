import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import { getContactsNumber } from 'base/js/utils';

export const statusToDialog = { // eslint-disable-line
	10: {
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Pending Request'
			},
			content: 'Your withdrawal request has been submitted. It is now waiting for confirmation. You can check the withdrawal records in a short while.',
			button: ['OK']
		},
		addEvent: dialog => {
			dialog && dialog.onBtnClick(btn => {
				console.log(btn);
				if (btn === 1) {
					window.location.href = userCenterUrl.transaction;
				}
			});
		}
	},
	30: {
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Failed to Withdraw'
			},
			content: 'We are unable to accept your payment at this time. Please check your payment information and try again later.', // 优先使用后台错误信息
			button: ['OK']
		}
		// addEvent: dialog => {
		// 	dialog && dialog.onBtnClick(btn => {
		// 		console.log(btn);
		// 		if (btn === 1) {
		// 			window.location.href = userCenterUrl.transaction;
		// 		}
		// 	});
		// }
	},
	72: { // 类似pending但使用后台错误信息
		dialog: {
			title: '<div class="title-with-icon"><i class="icon-warn"/><h1 class="warn-text">{{titleData.title}}</h1></div>',
			titleData: {
				title: 'Pending Request'
			},
			content: `Your account is under Financial Risk, to ensure your account's safety and security, we will conduct a manual audit. If you have any remaining questions, please contact us ${getContactsNumber()}.`,
			button: ['OK']
		},
		addEvent: dialog => {
			dialog && dialog.onBtnClick(btn => {
				console.log(btn);
				if (btn === 1) {
					window.location.href = userCenterUrl.transaction;
				}
			});
		}
	},
	81: {
		type: 'pin',
		title: 'Enter Card PIN',
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
	}
};
