import Vue from 'vue';
import { mapMutations, mapState, mapActions } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';
import * as mutationTypes from 'store/withdraw/gh/mutationTypes';
import { cookie } from 'storage';
import { checkWithdrawBlock } from 'components/withdrawBlockTip/withdrawDialog.js';
import {
	validateBankUnion
} from './commonFun';
import popComfirm from '../pagelet/popConfirm.vue';

export default {
	data() {
		return {
			wdLoading: false
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

			return this.amount && !this.isAmountError;
			// || this.usrName && !this.isNameError;
		},
		subText() {
			return this.wdLoading ? 'Loading...' : 'Withdraw';
		},
		hasError() {
			// const isHistoryName = this.isHistoryName || false;

			const validateRet = this.isAmountError;

			// if (!isHistoryName) {
			// 	validateRet = this.isNameError ||
			// 		validateRet;
			// }

			return validateRet;
		}
	},
	methods: {
		...mapMutations('withdraw', {
			saveWdInfo: mutationTypes.UPDATEWITHDRAWINFO
		}),
		...mapActions('userCenter', [
			'getBalance'
		]),
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
			if (this.wdLoading) {
				return;
			}
			if (!checkWithdrawBlock(this.auditStatus)) {
				return;
			}
			const params = {
				payAmount: this.amount || '',
				channel: this.channelSendName || '',
				channelShowName: this.channelShowName || '',
				channelIconUrl: this.channelIconUrl,
				phoneNo: cookie('phone') || ''
			};

			// if (this.isHistoryName) {
			// 	const bankHistory = this.bankHistory || {};
			// 	params.name = bankHistory.name || '';
			// } else {
			// 	params.name = this.usrName;
			// }

			const validateRet = validateBankUnion(Object.assign(
				params,
				{
					isHistoryPhone: this.isHistoryPhone
				}
			), this.balance);

			if (validateRet) {
				// this.nameError = validateRet.nameRet || '';
				this.amountError = validateRet.amountRet || '';
				return;
			}

			this.saveWdInfo(params);

			// 防止enter健再次发送请求，input blur
			const InputDomArr = document.querySelectorAll('#j_ghBank .m-input');
			for (const inputItem of InputDomArr) {
				inputItem.blur();
			}

			this.showConfirm();
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
				this.wdLoading = false;
			}
		},
		// currentBankIndex(val, oldVal) {
		// 	if (oldVal !== -1) {
		// 		this.clearUsrName();
		// 	}
		// }
	},
	mounted() {
		EventBus.$on(commonEvent.NOTIFY_CLEAR_AMOUNT, () => {
			this.clearAmount();
			this.getBalance();
		});

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
