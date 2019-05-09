<template lang="html">

<div class="m-dp-card" id="j_ngCard">
	<CardsType :cardTypes="cardTypes" />

	<template v-if="pageLoading">
		<div class="m-error-wrapper">
			<div>
				<i class="m-icon-loading"></i>
				<span class="m-text-msg">Loading...</span>
			</div>
		</div>
	</template>

	<template v-else>
		<template v-if="cardHistoryList.length">
			<CardList />
		</template>

		<template v-else>
			<AddCard />
		</template>
	</template>

</div>

</template>

<script>
import Vue from 'vue';
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import CommonPop from 'components/popDialog/commonPop';
import * as mutationsTypes from 'store/deposit/ng/mutationTypes';

import { EventBus } from 'kernel/js/eventBus.js';
import commonEvent from 'config/eventConfig/commonEvent';

import {
	cardTypes
} from '../js/config';

import CardsType from './cardsType.vue';
import AddCard from './addCard.vue';
import CardList from './cardList.vue';

import phoneVerify from './phoneVerify.vue';
import pinVerify from './pinVerify.vue';
import otpSpecialVerify from './otpSpecialVerify.vue';
import bankAuth from './popBankAuth.vue';
import holding from './holding.vue';

export default {
	components: {
		AddCard,
		CardsType,
		CardList
	},
	data() {
		return {
			cardTypes,
			pageLoading: true
		};
	},
	computed: {
		...mapState('deposit', [
			'cardHistoryList',
			'errorInfo',
			'verifyType',
			'reqLoading'
		]),
	},
	methods: {
		...mapActions('deposit', [
			'getHistoryList',
		]),
		...mapMutations('deposit', {
			chgVerifyType: mutationsTypes.UPDATEVERIFYTYPE,
			deleteRecord: mutationsTypes.UPDATECARDHISTORYLIST
		}),
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

						EventBus.$emit('clearCvv');
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
			case 'pin':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(pinVerify).mixin({
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
			case 'phone':
				this.$dialog();
				this.$dialog({
					title: null,
					content: Vue.extend(phoneVerify).mixin({
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
		this.getHistoryList({
			type: 1
		});
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.pageLoading = true;
				this.getHistoryList({
					type: 1
				});
			}
		});
	}
};

</script>

<style lang="less">
@import '../style/cardPanel.less';
@import '../style/pageLoading.less';
</style>
