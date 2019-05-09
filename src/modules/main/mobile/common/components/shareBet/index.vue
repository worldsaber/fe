<template>
	<div class="m-choose-bet" v-show="betVisible">
		<div class="m-choose-header">
			<div class="m-cancel-btn" @click="handleCancel">Cancel</div>
			<h2 class="m-title">Choose a bet</h2>
		</div>

		<TicketList @choose="choose"></TicketList>

		<TicketDetail
			v-if="drawVisible"
			:orderId="orderId"
			@ready="captureReady">
		</TicketDetail>

		<BetLoading v-show="loading" @click.stop="() => {}"></BetLoading>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { TOOGLE_BET_VISIBLE } from 'store/shareBet/mutationTypes';
import BetLoading from 'components/betLoading';
import TicketList from './pagelet/TicketList';
import TicketDetail from './pagelet/TicketDetail';

export default {
	name: 'ChooseBet',
	components: {
		BetLoading,
		TicketList,
		TicketDetail
	},
	data() {
		return {
			loading: false,
			drawVisible: false,
			orderId: ''
		};
	},
	computed: {
		...mapState('shareBet', ['betVisible'])
	},
	methods: {
		...mapMutations('shareBet', {
			toogleBetVisible: TOOGLE_BET_VISIBLE
		}),
		close() {
			this.toogleBetVisible(false);
		},
		handleCancel() {
			this.close();
			this.restoreMainScroll();
			this.$emit('cancel');
		},
		choose(orderId) {
			this.orderId = orderId;
			// 先通知外面已经选中了
			this.$emit('choose');
			// 开画
			this.drawVisible = true;
			this.loading = true;
		},
		captureReady() {
			this.loading = false;
			this.drawVisible = false;
			this.close();
			this.restoreMainScroll();
			this.$emit('ready');
		},
		forbidMainScroll() {
			document.querySelector('.m-main-mid').addClass('no-scroll');
		},
		restoreMainScroll() {
			document.querySelector('.m-main-mid').removeClass('no-scroll');
		}
	},
	created() {
		this.forbidMainScroll();
	},
	beforeDestroy() {
		this.restoreMainScroll();
	},
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.no-scroll {
	overflow: hidden!important;
}

.m-choose-bet {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	height: 100%;
	background: @white;

	.m-ticket-list {
		padding-top: 48/@rem;
	}
}

.m-choose-header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1;
	height: 48/@rem;
	line-height: 48/@rem;
	padding: 0 16/@rem;
	border-bottom: 1px solid @fogGrayBorder;
	background: @white;

	.m-cancel-btn {
		color: #3656a3;
		font-size: 14/@rem;
		position: absolute;
		left: 16/@rem;
		top: 0;
	}

	.m-title {
		font-size: 18/@rem;
		color: @dark;
		text-align: center;
	}
}
</style>
