<template>
	<div class="m-ticket-list-wrap m-ticket-load-wrap" ref="list" v-loading:fetchData="loading">
		<div class="m-ticket-list">
			<!-- 列表循环部分 -->
			<template v-for="(item, index) in ticketList">
				<Ticket :ticket="item" :key="index" @choose="choose"></Ticket>
			</template>

			<NoDataTips v-if="!loading && !ticketList.length">No tickets available</NoDataTips>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { UPDATESETTLETYPE } from 'store/order/mutationTypes.js';
import throttle from 'utils/throttle.js';
import NoDataTips from 'components/NoDataTips';
import Ticket from './Ticket';

export default {
	name: 'TicketList',
	components: {
		NoDataTips,
		Ticket
	},
	data() {
		return {
			showDate: false,
			currency: window.currency,
			loading: true
		};
	},
	computed: {
		...mapState('order', ['ticketList', 'totalOrder']),
		hasMoreList() {
			const len = this.ticketList.length;
			return len > 0 && len < this.totalOrder;
		},
	},
	methods: {
		...mapActions('order', ['fetchTicketList']),
		...mapMutations('order', {
			updateSettleType: UPDATESETTLETYPE
		}),
		async fetchData() {
			this.loading = true;
			try {
				await this.fetchTicketList();
				this.loading = false;
			} catch (err) {
				console.log(err); // eslint-disable-line
				this.loading = -1;
			}
		},
		choose(orderId) {
			this.$emit('choose', orderId);
		},
		loadMore() {
			const listEl = document.querySelector('.m-ticket-list');
			return throttle(() => {
				if (this.loading || !this.hasMoreList) return;
				const { height, top } = listEl.getBoundingClientRect();
				if (height + top <= window.innerHeight + 20) {
					this.fetchData();
				}
			}, 500);
		}
	},
	created() {
		this.updateSettleType('All');
		this.fetchData();
	},
	mounted() {
		this.$refs.list.addEventListener('scroll', this.loadMore());
	},
	beforeDestroy() {
		this.$refs.list.removeEventListener('scroll', this.loadMore());
	},
};
</script>

<style lang="less">
@import "base/styles/variable.less";

.m-ticket-list-wrap {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: auto;

	&.m-ticket-load-wrap {
		.m-loading-wrap {
			position: relative;
			bottom: 0;
			min-height: 180/@rem;
		}
	}
}

.m-ticket-list {
	padding: 0 16/@rem;
	overflow: hidden;
}
</style>
