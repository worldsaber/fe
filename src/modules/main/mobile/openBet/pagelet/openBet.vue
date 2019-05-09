<template lang="html">
	<div class="m-openbet">
		<div class="m-error-wrapper" v-if="!isLogin">
			<div>
				<span class="m-error-msg">Please Log In to see your Open Bets and Cashout Bets.</span>
				<div class="m-btn--text" @click="seeCashout">What is Cashout?</div>
				<div class="m-btn" @click="login">Log In</div>
			</div>
		</div>

		<div class="m-error-wrapper" v-else-if="pageError">
			<div>
				<span class="m-error-msg">Sorry, something went wrong. Please try again later.</span>
				<div class="m-btn" @click="loadData">Retry</div>
			</div>
		</div>

		<div class="m-error-wrapper" v-else-if="pageLoading">
			<div>
				<i class="m-icon-loading"></i>
				<span class="m-text-msg">Loading...</span>
			</div>
		</div>

		<div class="m-error-wrapper" v-else-if="!hasData">
			<div>
				<span class="m-error-msg">You currently have no Open Bets and Cashout Bets.</span>
				<div class="m-btn--text" @click="seeCashout">What is Cashout?</div>
			</div>
		</div>

		<template v-else>
			<BetList />
		</template>

		<AdBanner keyword="openBetsFooter" v-if="(!pageError && !pageLoading) && (!isLogin || !hasData)" />
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';
import { isEmptyObject } from 'utils';
import { pagePath } from 'config/pageConfig';
import commonEvent from 'config/eventConfig/commonEvent';
import 'components/login/popupLogin';

import PageMixin from '../js/pageMixin';
import PageComMixin from '../js/commonMixin';

import BetList from './list.vue';
import SucPop from './popSuc.vue';

export default {
	components: {
		BetList
	},
	mixins: [
		PageMixin,
		PageComMixin
	],
	data() {
		return {
			curBet: '',
			pageError: false
		};
	},
	computed: {
		...mapState('openBet', [
			'errorInfo',
			'isLogin',
			'pageIndex',
			'cfgInfo',
			'lockPageUpdate'
		]),
		...mapGetters('openBet', [
			'hasData'
		])
	},
	watch: {
		isLogin(val) {
			if (val) {
				this.loadData(isEmptyObject(this.cfgInfo));
			}
		},
		pageIndex(val) {
			if (!this.lockPageUpdate) {
				this.loadData();
			}
		},
		errorInfo(val) {
			const { type = '', msg = '' } = val || {};

			switch (type) {
			case 'login':
				this.login();
				return;
			case 'success':
				// 成功确认 刷新页面
				EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
				this.$dialog({
					title: null,
					css: 'm-openBet--suc',
					content: SucPop,
					contentData: val,
					button: ['OK']
				}).onBtnClick(() => {
					this.handlePop('refresh');
				});
				return;
			case 'load_error_list':
				this.pageError = true;
				return;
			case 'load_error_detail':
				if (val.from === 'pop_cashout' || val.from === 'detail_refresh' || val.from === 'pop_refresh') {
					this.$dialog();
					this.$toast('Failed to load data. Please try again.');
				}
				break;
			case 'dialog':
				this.$dialog();
				this.$dialog({
					title: null,
					content: msg,
					button: ['OK']
				}).onBtnClick(() => {
					this.handlePop(val.optType);
				});
				break;
			default:
			}
		}
	},
	methods: {
		...mapActions('openBet', [
			'getBetList',
			'getCashoutCfg'
		]),
		loadData(loadCfg = false) {
			if (this.pageLoading) {
				return;
			}

			this.pageLoading = true;
			this.pageError = false;
			this.getBetList();
			loadCfg && this.getCashoutCfg();
		},
		seeCashout() {
			location.href = `${pagePath.help}#/how-to-play/others/how-to-cashout`;
		},
		handlePop(optType) {
			if (optType === 'refresh') {
				this.loadData();
				this.$emit('resetStatus');
			}
		}
	},
	created() {
		this.isLogin && this.loadData(true);
	},
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';
.m-btn--text {
	color: @green;

	+.m-btn {
		margin-top: 20/@rem;
	}
}
</style>
<style media="screen" lang="less">
@import '../style/pagination.less';
</style>
