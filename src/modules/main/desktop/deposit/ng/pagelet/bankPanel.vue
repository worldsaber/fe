<template lang="html">
  <div class="m-dp-bank" id="j_ngBank">
	<template v-if="pageLoading">
		<div class="m-error-wrapper">
			<div>
				<i class="m-icon-loading"></i>
				<span class="m-text-msg">Loading...</span>
			</div>
		</div>
	</template>

	<template v-else>
		<CardsType :cardTypes="bankIconList" />

		<template v-if="bankHistoryList.length">
			<BankList />
		</template>

		<template v-else>
			<AddBank />
		</template>

	</template>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import CommonPop from 'components/popDialog/commonPop';
import * as mutationsTypes from 'store/deposit/ng/mutationTypes';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

import CardsType from './cardsType.vue';
import AddBank from './addBank.vue';
import BankList from './bankList.vue';

import birthdayVerify from './birthVerify.vue';
import bankAuth from './popBankAuth.vue';
import otpSpecialVerify from './otpSpecialVerify.vue';
import holding from './holding.vue';

export default {
	components: {
		CardsType,
		AddBank,
		BankList
	},
	data() {
		return {
			pageLoading: true
		};
	},
	computed: {
		...mapState('deposit', [
			'bankList',
			'bankHistoryList',
			'errorInfo',
			'verifyType',
			'reqLoading'
		]),
		bankIconList() {
			const bankList = this.bankList || [];
			const ret = {};

			for (const item of bankList) {
				item.bankIconUrl && (ret[item.bankCode] = item.bankIconUrl);
			}

			return ret;
		}
	},
	methods: {
		...mapActions('deposit', [
			'getHistoryList',
			'getBankList'
		]),
		...mapMutations('deposit', {
			chgVerifyType: mutationsTypes.UPDATEVERIFYTYPE,
			deleteRecord: mutationsTypes.UPDATEBANKHISROEYLIST
		}),
		getData() {
			Promise.all([
				this.getHistoryList({ type: 2 }),
				this.getBankList()
			]).then(list => {
			});
		}
	},
	watch: {
		reqLoading(val, oldVal) {
			if (!val) {
				setTimeout(() => {
					this.pageLoading = false;
				}, 500);
			}
		},
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'dialog':
				this.$dialog();
				this.$dialog({
					title: null,
					contentData: {
						title: val.title || '',
						msg: val.msg,
						cssList: val.showIcon ? 'm-dialog--tips' : ''
					},
					content: CommonPop,
					button: []
				}).onBtnClick(btnType => {
					if (val.jmp) {
						location.href = val.jmp;
					}

					if (val.deleteRecord) {
						this.deleteRecord({
							type: 'delete'
						});
					}
				});
				break;
			case 'jmp':
				// window.open(val.jumpUrl);
				// this.chgVerifyType('bank');
				location.href = val.jumpUrl;

			default:
			}
		},
		verifyType(val) {
			switch (val) {
			case 'holding':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(holding).mixin({
						store: window.v_store
					}),
					button: []
				});
				break;
			case 'birthday':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(birthdayVerify).mixin({
						store: window.v_store
					}),
					button: []
				});
				break;
			case 'dialOtp':
			case 'opt':
			case 'secondOtp':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(otpSpecialVerify).mixin({
						store: window.v_store
					}),
					button: []
				});
				break;
			case 'bank':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(bankAuth).mixin({
						store: window.v_store
					}),
					button: []
				});
				break;
			default:
			}
		}
	},
	created() {
		this.getData();
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.pageLoading = true;
				this.getData();
			}
		});
	}
};
</script>

<style lang="less">
@import '../style/bankPanel.less';

</style>
