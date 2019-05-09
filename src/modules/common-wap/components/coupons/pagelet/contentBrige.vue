<template>
<div class="m-coupon-wrapper">
	<transition name="slide">
		<div class="m-coupon-content" v-if="!isPack">
			<Navbar backText="Use Gift" :backClick="togglePack">
				<div :class="[
							'm-refresh',
							{
								'is-disabled': loading
							}
						]"
						@click="handleRefresh" slot="right"
					>Refresh</div>
			</Navbar>
			<template  v-if="hasData && !errorInfo">
				<div class="m-coupon-opt" v-if="isShowNote">
					<p class="m-coupon-tips">Note:Cashout is unavailable with bets using gifts.</p>
				</div>
				<CouponsList :totalStake="totalStake"/>
			</template>
			<CouponsError v-else :reloadFun="loadData" />
		</div>
	</transition>
</div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import * as mutationTypes from 'store/coupons/mutationTypes';
import Navbar from 'components/navbar/index.vue';
import CouponsError from './error.vue';
import CouponsList from './list.vue';

export default {
	props: {
		// 当前订单的总共金额
		totalStake: {
			required: true,
			type: Number
		},
		isShowNote: {
			type: Boolean,
			'default': true
		}
	},
	components: {
		CouponsError,
		CouponsList,
		Navbar,
	},
	computed: {
		...mapState('coupons', [
			'loading',
			'couponsCount',
			'errorInfo',
			'isPack',
			'couponsGroupList'
		]),
		...mapGetters('coupons', [
			'checkItem',
			'checkGiftId',
			'skipStaus'
		]),
		hasData() {
			return !!this.couponsGroupList.length;
		}
	},
	methods: {
		...mapActions('coupons', [
			'getCouponsGroup'
		]),
		...mapMutations('coupons', {
			togglePack: mutationTypes.TOGGLE_PACK,
			resetCouponsList: mutationTypes.RESETCOUPONSLIST,
			setSportType: mutationTypes.UPDATEBIZTYPE,
			updateRealCouponsGroupList: mutationTypes.UPDATE_REAL_COUPONS_GROUP_LIST
		}),
		loadData() {
			this.resetCouponsList(false);
			this.getCouponsGroup({
				betType: 0
			}).then(() => {
				this.updateRealCouponsGroupList(this.totalStake);
			});
		},
		handleRefresh() {
			this.loadData();
		}
	}
};
</script>

<style lang="less">

</style>
