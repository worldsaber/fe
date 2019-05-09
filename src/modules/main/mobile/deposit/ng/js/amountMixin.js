import {
	// modifyAmount,
	validateAmount
} from './commonFun.js';

export default {
	data() {
		return {
			amount: '',
			amountErr: '',
		};
	},
	methods: {
		blurAmount() {
			// if (this.amountErr === '') {
			// 	this.amount = modifyAmount(this.amount, true);
			// }
		},
		clearAmount() {
			this.amount = '';
		},
		handleAmountFocus(event) {
			const target = event.target;

			if (!target) {
				return;
			}

			if (target.scrollIntoView) {
				target.scrollIntoView();
			} else {
				const winHeight = document.documentElement.clientHeight || document.body.clientHeight,
					scrollTop = window.scorllY || window.pageYOffset,
					targetRect = target.getBoundingClientRect(),
					distance = targetRect.top + targetRect.height;

				if (distance - scrollTop > winHeight) {
					window.scrollTo({
						top: distance - winHeight,
						behavior: 'smooth'
					});
				}
			}
		}
	},
	watch: {
		amount(val) {
			this.amount = ('' + val).replace(/[^0-9.]/g, '');
			if (val !== '') {
				this.amountErr = validateAmount(this.amount, 'deposit', true) || '';
			} else {
				this.amountErr = '';
			}
		}
	}
};
