import Vue from 'vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import * as mutationTypes from 'store/withdraw/ng/mutationTypes';
import * as codeMutationTypes from 'store/codeVerify/mutationTypes';
import { checkWithdrawBlock } from 'components/withdrawBlockTip/withdrawDialog.js';
import {
	validateBankUnion
} from './commonFun';
import popComfirm from '../pagelet/popConfirm.vue';

export default {
	data() {
		return {
			accountLoading: false
		};
	},
	computed: {
		...mapState('withdraw', [
			'reqLoading'
		]),
		...mapState('userCenter', [
			'balance',
			'auditStatus'
		]),
		submitStatus() {
			if (this.hasError) {
				return false;
			}

			const isHistoryBank = this.isHistoryBank || false;

			let validateRet = this.amount && !this.isAmountError;

			if (!isHistoryBank) {
				validateRet = this.bankCode && !this.isBankCodeError ||
					this.bankNum && !this.isBankNumError ||
					validateRet;
			}

			return validateRet;
		},
		subText() {
			return this.accountLoading ? 'Loading...' : 'Withdraw';
		},
		hasError() {
			const isHistoryBank = this.isHistoryBank || false;

			let validateRet = this.isAmountError;

			if (!isHistoryBank) {
				validateRet = this.isBankCodeError ||
					this.isBankNumError ||
					validateRet;
			}

			return validateRet;
		}
	},
	methods: {
		...mapMutations('withdraw', {
			saveWdInfo: mutationTypes.UPDATEWITHDRAWINFO
		}),
		...mapActions('withdraw', [
			'getAccountInfo'
		]),
		...mapMutations('codeVerify', {
			resetCodeInfo: codeMutationTypes.RESETCODEINFO
		}),
		showConfirm() {
			this.$dialog();
			this.$dialog({
				title: null,
				content: Vue.extend(popComfirm).mixin({
					store: window.v_store
				}),
				button: []
			});
		},
		submit() {
			if (this.accountLoading) {
				return;
			}
			if (!checkWithdrawBlock(this.auditStatus)) {
				return;
			}
			const isHistoryBank = this.isHistoryBank || false;
			let params = {
				amount: this.amount || ''
			};

			if (!isHistoryBank) {
				params = Object.assign(params, {
					bankNum: this.bankNum,
					bankCode: this.bankCode,
					isNew: true
				});
			} else {
				params = Object.assign(params, {
					bankCode: this.bankCode || ''
				});
			}

			const validateRet = validateBankUnion(params, this.balance);

			if (validateRet) {
				this.bankNumError = validateRet.bankRet || '';
				this.bankCodeError = validateRet.bankCodeRet || '';
				this.amountError = validateRet.amountRet || '';
				return;
			}

			params = {
				payAmount: this.amount
			};
			if (isHistoryBank) {
				const selectBankInfo = this.bankHistoryList[this.checkedIndex];
				params = Object.assign(params, {
					bankAssetId: selectBankInfo.id,
					bankAccNum: selectBankInfo.accountNumber,
					bankName: selectBankInfo.bankName,
					bankCode: selectBankInfo.bankCode,
					bankAccount: selectBankInfo.accountName,
					isNew: false
				});
			} else {
				params = Object.assign(params, {
					bankAccNum: this.bankNum,
					bankName: this.selectBank,
					bankCode: this.bankCode,
					isNew: true
				});
			}

			this.saveWdInfo(params);
			this.resetCodeInfo();

			// 防止enter健再次发送请求，input blur
			const InputDomArr = document.querySelectorAll('#j_ngBank .m-input');
			for (const inputItem of InputDomArr) {
				inputItem.blur();
			}

			if (isHistoryBank) {
				this.showConfirm();
			} else {
				this.accountLoading = true;
				this.getAccountInfo().then(ret => {
					if (ret.loadAccName) {
						this.showConfirm();
					}
				}).catch(() => {});
			}
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.accountLoading = false;
			}
		},
		// 切换银行，清空错误
		bankCode(val) {
			this.bankNumError = '';
		}
	},
	mounted() {
		EventBus.$on(commonEvent.NOTIFY_CLEAR_AMOUNT, () => {
			this.clearAmount();
		});

		document.querySelector('#j_ngBank').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngBank').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
