import { mapActions, mapState } from 'vuex';
import {
	LS,
	cookie
} from 'storage';
import CommonPop from 'components/popDialog/commonPop';

import {
	validateBankUnion,
	modifyPhone
} from './commonFun';

import {
	chgPhoneTips
} from './config';

const showChgPTips = LS.get('pc_gh_dp_pTip') || '0';
const regPhone = cookie('phone') || '';

export default {
	data() {
		return {
			showDiffPhoneTips: +showChgPTips
		};
	},
	computed: {
		...mapState('deposit', [
			'bankHistory'
		]),
		submitStatus() {
			if (this.hasError) {
				return false;
			}

			let validateRet = this.amount && !this.isAmountError ||
				this.phoneNo && !this.isPhoneErr;

			if (this.needVCode) {
				validateRet = validateRet || this.vCode && !this.isVCodeErr;
			}
			return validateRet;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Top Up Now';
		},
		hasError() {
			const isHistoryPhone = this.isHistoryPhone || false;

			let validateRet = this.isAmountError;

			if (this.needVCode) {
				validateRet = this.isVCodeErr || validateRet;
			}

			if (!isHistoryPhone) {
				validateRet = this.isPhoneErr || validateRet;
			}

			return validateRet;
		}
	},
	watch: {
		currentBankIndex(val, oldVal) {
			if (oldVal !== -1) {
				// this.clearPhone();
			}
		}
	},
	methods: {
		...mapActions('deposit', [
			'deposit'
		]),
		submit() {
			if (this.loading) {
				return;
			}
			const params = {
				payAmount: this.amount || '',
				channel: this.channelSendName || '',
				channelIconUrl: this.channelIconUrl,
				channelShowName: this.channelShowName
			};

			if (this.isHistoryPhone) {
				const bankHistory = this.bankHistory || {};
				params.phoneNo = bankHistory.phoneNo || '';
			} else {
				params.phoneNo = this.originPhoneNo;
			}

			if (this.needVCode) {
				params.token = this.vCode;
			}

			const validateRet = validateBankUnion(Object.assign({},
				params,
				{
					needVCode: this.needVCode,
					isHistoryPhone: this.isHistoryPhone
				}
			));

			if (validateRet) {
				this.phoneErr = validateRet.phoneRet || '';
				this.amountError = validateRet.amountRet || '';
				this.vCodeErr = validateRet.vCodeRet || '';
				return;
			}

			// 防止enter健再次发送请求，input blur
			const InputDomArr = document.querySelectorAll('#j_ghBank .m-input');
			for (const inputItem of InputDomArr) {
				inputItem.blur();
			}

			if (!this.showDiffPhoneTips && regPhone.replace(/^0/, '') !== this.originPhoneNo.replace(/^0/, '')) {
				this.$dialog();
				this.$dialog({
					title: null,
					contentData: {
						title: 'Note',
						msg: `${chgPhoneTips} (${modifyPhone(regPhone)})`,
						cssList: 'm-dp-pop--tips',
						okBtn: 'Continue Depositing',
						cancelBtn: 'Cancel',
						cancalBtnType: 'text'
					},
					content: CommonPop,
					button: []
				}).onBtnClick(btnType => {
					if (btnType === 'ok') {
						this.loading = true;
						this.deposit(params);
					}
				});

				LS.set('pc_gh_dp_pTip', 1);
				this.showDiffPhoneTips = 1;
			} else {
				this.loading = true;
				this.deposit(params);
			}
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ghBank').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ghBank').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
