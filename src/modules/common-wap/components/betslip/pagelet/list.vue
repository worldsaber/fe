<template>
	<div class="m-betslips-outcomes" id="j_betList">
		<!-- 一直显示 -->
		<div class="m-outcomes-nav">
			<!-- 玩法是system，并且不选择同一个event的情况,并且不是隐藏list -->
			<div class="m-outcomes-banker" v-show="isShowList && supportBanker">
				<Check :checked="bankerStatus" @input='changeBankerStatus' text="Banker"></Check>
				<span @click="showBankerHelp" class="m-banker-tip"></span>
			</div>
		</div>
		<!-- outcome列表 -->
		<div class="m-outcomes-list" v-show="isShowList">
			<template v-for="bet in betslips">
				<BetEvent
					:key="bet.key"
					:bet="bet"
					:lastChangeItem="lastChangeItem"
					:needShowBoostingOdds="needShowBoostingOdds">
				</BetEvent>
			</template>
	  	</div>

		<!-- multiple bonus 提示 -->
		<BonusTips v-if="currentType === 'multiple'" :betslips="betslips" />
		<!-- booster 广告 -->
		<BoosterAds v-if="currentType === 'single'" />

		<p class="mutex-tips" v-if="hasMutexGroup && (currentType === 'multiple' || currentType === 'system')">Note：You have selected contingent outcomes.</p>

		<!-- system stake select -->
		<div class="m-system-bet" v-if="currentType === 'system'">
			<NumberInput
				class="m-input"
				:max="maxStake"
				:min="minStake"
				:value="String(systemStake.union || '')"
				@input="changeSystemUnin"
				:length="String(maxStake).length"
				:placeholder="'min.' + minStake">
				<template slot="inputBefore">
					<span>Play All</span>
					<span class="currency"><em>{{showCurrency}}</em></span>
				</template>
			</NumberInput>

			<div class="stake-input-wrapper" v-for="(one, index) in stakeUnion" :key="index">
				<NumberInput
					class="m-input"
					:max="maxStake"
					:min="minStake"
					:length="String(maxStake).length"
					:value="String(systemStake[one.name] || '')"
					@input="changeSystemStake(one.name, $event)"
					:placeholder="'min.' + minStake">
					<template slot="inputBefore">
						<span>{{one.name}}</span>
						<span class="bet-count"><em>{{one.count}}</em></span>
						<span class="currency"><em>{{showCurrency}}</em></span>
					</template>
				</NumberInput>
			</div>
		</div>
	</div>
</template>

<script>
import {
	mapMutations,
	mapGetters,
	mapState,
	mapActions
} from 'vuex';
import {
	CHANGE_BANKER_STATUS
} from 'store/betslip/mutationTypes';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import {
	UPDATE_STAKE,
	RESET_STAKE
} from 'store/betslipStake/mutationTypes';
import NumberInput from './numberInput.vue';
import Check from './check.vue';
import BetEvent from './betEvent.vue';
import BonusTips from './bonusTips.vue';
import BoosterAds from './boosterAds.vue';

const bankHelp = {
	render (h) {
		return h('p', 'A banker is a selection which a customer believes is certain to win. If a Banker is selected, it will be included in every combination and must win in order to provide a return on the bet.');
	}
};
export default {
	data () {
		return {
			isShowList: true,
			lastChangeItem: '',
			needShowBoostingOdds: false
		};
	},
	watch: {
		changeOutcomes () {
			if (this.acceptStatus) {
				this.lastChangeItem = this.changeOutcomes && this.changeOutcomes.length ?
					this.changeOutcomes[this.changeOutcomes.length - 1] : '';
			} else {
				this.lastChangeItem = '';
			}
		},
		currentType () {
			// system 类型添加默认 stake = window.sportsCfg.min
			if (this.currentType === 'system') {
				const hasValue = Object.entries(this.systemStake)
					.some(([k, v]) => k !== 'union' && !!v);
				const sportsCfg = window.sportsCfg || {};
				if (!hasValue) {
					this.changeSystemUnin(sportsCfg.min || '50');
				}
			}
		},
		usingOddsBoost (val) {
			if (val) {
				this.needShowBoostingOdds = true;
			} else {
				this.needShowBoostingOdds = false;
			}
		}
	},
	components: {
		NumberInput,
		Check,
		BetEvent,
		BonusTips,
		BoosterAds
	},
	computed: {
		...mapGetters('betslip', ['supportBanker', 'supportMultiple', 'hasMutexGroup']),
		...mapState('betslip', ['betslips', 'currentType', 'bankerStatus', 'changeOutcomes', 'acceptStatus', 'usingOddsBoost']),
		...mapState('betslipStake', ['systemStake', 'showCurrency', 'minStake', 'maxStake']),
		...mapGetters('betslipStake', ['stakeUnion']),
	},
	methods: {
		...mapMutations('betslip', [CHANGE_BANKER_STATUS]),
		...mapActions('betslip', ['clearAllBetSlip']),
		...mapMutations('betslipStake', [UPDATE_STAKE, RESET_STAKE]),
		...mapMutations('coupons', {
			resetCoupons: couponMutationTypes.RESETCOUPONSLIST
		}),
		// 清除全部
		clearAll () {
			this.resetStake();
			this.resetCoupons(true);
			this.clearAllBetSlip();
		},
		// 隐藏投注项目，暂时无用
		hideList () {
			this.isShowList = !this.isShowList;
		},
		// 显示帮助弹窗
		showBankerHelp () {
			this.$dialog({
				content: bankHelp,
				title: 'What is a Banker ?',
				button: ['OK']
			});
		},
		// 修改system的stake
		changeSystemStake (name, val) {
			// 改变任意一个stake则，union变成空
			this.updateStake({
				type: 'system',
				stake: {
					[name]: val,
					union: ''
				}
			});
		},
		// 修改system的unin
		changeSystemUnin (val, key) {
			const stake = {
				union: val
			};
			this.stakeUnion.forEach(one => {
				stake[one.name] = val;
			});
			this.updateStake({
				type: 'system',
				stake
			});
		},
	},
	updated () {
		this.$nextTick(() => {
			if (!this.needShowBoostingOdds) {
				return;
			}
			const betWrapper = document.querySelector('#j_betList'),
				boostBet = betWrapper && betWrapper.querySelector('.is-boost-item');
			if (!boostBet) {
				return;
			}
			if (boostBet.scrollIntoView) {
				boostBet.scrollIntoView();
			} else {
				const scrollWrap = document.querySelector('.m-scroll-wrapper .m-scroll'),
					tempTop = boostBet.offsetTop;
				scrollWrap.scrollTop = tempTop;
			}
			this.needShowBoostingOdds = false;
		});
	}
};
</script>

<style lang="less" scoped>
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
@import "~base/styles/mixin.less";
.m-betslips-outcomes {
	// 顶部操作条，显示隐藏，删除全部
	.m-outcomes-nav {
		display: flex;
		align-items: center;
		padding: 0 10/@rem;
		box-shadow: 0 0 6px 0 fade(@black, 15%);
		& > div {
			flex: 1;
			&:last-child {
				text-align: right;
			}
		}
		// banker操作
		.m-outcomes-banker {
			padding: 7/@rem 0;
			text-align: right;
			& > span {
				display: inline-block;
			}
			.m-banker-tip {
				.m-icon-tips();
				&::before {
					vertical-align: middle;
					color: @darkGray;
				}
			}
		}
	}

	.mutex-tips {
		line-height: 1.13;
		height: 17/@rem;
		font-size: 12/@rem;
		color: @darkGray;
		text-align: center;
		padding: 8/@rem 0;
	}
	.m-system-bet {
		padding: 15/@rem 0; // border-top: 6/@rem solid @lightGray;
		.m-input {
			height: auto;
			padding: 3/@rem 0;
			font-size: 14/@rem;
		}
	}
}
@keyframes slideOut {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(0.83);
	}
}
@keyframes slideIn {
	0% {
		transform: scale(1);
	}
	75% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes slideWrap {
	0% {
		transform: translate3d(0, 0, 0);
	}
	100% {
		transform: translate3d(0, 50%, 0);
	}
}
</style>
