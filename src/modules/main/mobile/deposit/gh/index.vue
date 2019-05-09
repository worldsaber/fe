<template lang="html">
	<div class="m-dp-gh">
		<Success v-if="dpSuccess"/>

		<MtnCfm v-else-if="isShowMtnCfmPop" />

		<DpConfirm v-else-if="isShowConfrimPop"/>

		<template v-else>
			<navbar><i slot="right" class="m-icon-help" @click.stop="depositHelp"></i></navbar>

			<DpNav />

			<Notification type="info" :text="notifyContent"/>

			<div class="f-dp">
				<template v-if="isOnline">
					<Online />
				</template>

				<template v-else>
					<PayBill />
				</template>
			</div>

			<DepositTips :lines="lines"/>
		</template>
	</div>

</template>

<script>
import {
	mapState,
	mapGetters,
	mapMutations,
	mapActions
} from 'vuex';
import {
	UPDATEDEPOSITTYPE,
	UPDATEPAGEMODULE
} from 'store/deposit/gh/mutationTypes';
import { pagePath } from 'config/pageConfig.js';
import commonEvent from 'config/eventConfig/commonEvent';
import {
	EventBus
} from 'kernel/js/eventBus';
import 'components/login/popupLogin';
import { getConfig } from 'deposit/index';
import navbar from 'components/navbar';
import Notification from 'components/notification';

import {
	depositType
} from './js/config';

import DpNav from './pagelet/nav.vue';
import DepositTips from './pagelet/depositTips.vue';
import Success from './pagelet/success.vue';
import Online from './pagelet/online.vue';
import PayBill from './pagelet/paybill.vue';
import DpConfirm from './pagelet/dpConfirm.vue';
import MtnCfm from './pagelet/mtnConfirm.vue';

const tabMap = {
	paybill: 9,
	online: 11,
};

export default {
	components: {
		navbar,
		DpNav,
		DepositTips,
		Success,
		Online,
		PayBill,
		DpConfirm,
		Notification,
		MtnCfm
	},
	computed: {
		...mapState('deposit', [
			'depositType',
			'errorInfo',
			'pageModule',
			'sysNotification',
			'dpInfo',
			'reqLoading'
		]),
		...mapGetters('deposit', [
			'dpSuccess',
			'showSysNotification'
		]),
		isOnline() {
			return this.depositType === depositType[0].key;
		},
		isShowConfrimPop() {
			return this.pageModule === 'confirm';
		},
		isShowMtnCfmPop() {
			// const dpInfo = this.dpInfo || {};
			// return this.isShowConfrimPop && dpInfo.channelShowName && dpInfo.channelShowName === 'MTN Mobile Money';
			return false;
		}
	},
	data() {
		return {
			pageLoading: true,
			notifyFn: () => {},
			notifyContent: '',
			linesFn: () => {},
			lines: [],
		};
	},
	watch: {
		dpSuccess(val) {
			if (val) {
				const errorInfo = this.errorInfo || {};

				if (!errorInfo.msg) {
					this.$dialog();
				}
			}
		},
		errorInfo(val) {
			const type = val && val.type || '';

			switch (type) {
			case 'login':
				this.$dialog();
				this.$popupLogin.show();
				break;
			case 'dialog':
				this.$dialog();
				this.$dialog({
					title: val.title || null,
					width: '85%',
					content: val.msg,
					button: ['OK']
				}).onBtnClick(btnType => {
					if (val.jmp) {
						location.href = val.jmp;
						return;
					}

					if (this.isShowConfrimPop) {
						this.chgPageModule('index');
					}
				});
				break;
			default:
			}
		},
		reqLoading(val) {
			if (!val) {
				this.pageLoading = false;
			}
		},
		pageLoading(val) {
			if (!val) {
				const loading = document.querySelector('#pageLoading');
				loading && (loading.style.display = 'none');
			}
		},
		depositType(val) {
			this.notifyContent = this.notifyFn(tabMap[val]);
			this.lines = this.linesFn(tabMap[val]);
		}
	},
	methods: {
		...mapMutations('deposit', {
			chgDpType: UPDATEDEPOSITTYPE,
			chgPageModule: UPDATEPAGEMODULE
		}),
		...mapActions('deposit', [
			'getBankList',
			// 'getSysNote',
			'getHistoryList'
		]),
		...mapActions('assetsInfo', [
			'fetchAcountInfo'
		]),
		depositHelp() {
			location.href = pagePath.help + '#/how-to-play/others/how-to-deposit';
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.getHistoryList();
			this.getBankList();
			this.fetchAcountInfo();
			// this.getSysNote();
		},
	},
	created () {
		this.chgDpType(depositType[0].key);
		this.getHistoryList();
		this.getBankList();
		this.fetchAcountInfo();
		// this.getSysNote();
		getConfig().then(data => {
			if (data.notifyContent) {
				this.notifyFn = data.notifyContent;
				this.notifyContent = this.notifyFn(9);
			}
			if (data.lines) {
				this.linesFn = data.lines;
				this.lines = this.linesFn(9);
			}
		});
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
};
</script>

<style lang="less">
@import './style/layout.less';
</style>
