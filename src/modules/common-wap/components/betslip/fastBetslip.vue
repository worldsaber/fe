<template>
	<div class="m-fast-betslip">
		<div class="close-icon" @click="close">
			<img src="./image/icon-close.png" alt="close" />
		</div>
		<oddsBoostTip v-if="showBoostTips" type="fast" />
		<fastList ref="fastList"/>
		<coinRadioGroup v-if="showCoinGroup" :totalStake="showStakeUnion.totalStake"/>
		<div class="m-blur-area" @blur="hide" tabindex="0">
			<div class="m-coupons-wrap">
				<Coupons
					v-show="showGift"
					:sportType="1"
					:totalStake="showStakeUnion.totalStake"
					tipsKey="s_gift_tips"
					:isShowGiftTips="true"
					contentInsertSelector="body">
				</Coupons>
			</div>
			<Keyboard ref="keyboard" class="m-fastMode-keyboard" :disableBlur="true"/>
		</div>
		<fastStake :showStakeUnion="showStakeUnion"/>
	</div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { UPDATE_FAST_MODE } from 'store/betslip/mutationTypes';
import Coupons from 'components/coupons/index.vue';
import BetLoading from 'components/betLoading';
import coupons from 'store/coupons/modules';
import oddsBoostTip from './pagelet/oddsBoostTip';
import fastList from './pagelet/fastList';
import Keyboard from './pagelet/keyboard.vue';
import fastStake from './pagelet/fastStake.vue';
import coinRadioGroup from './pagelet/coinRadioGroup.vue';
import stakeUnionMixins from './js/calcStakeUnionMixins';

export default {
	mixins: [stakeUnionMixins],
	components: {
		oddsBoostTip,
		fastList,
		Coupons,
		Keyboard,
		coinRadioGroup,
		fastStake
	},
	data() {
		return {
			// showKeyboard: false
			showGift: false
		};
	},
	watch: {
		checkItem() {
			this.updateCouponsStatus();
		},
		betLoading(val) {
			if (this.betLoadingEle) {
				this.betLoadingEle.$el.style.display = val ? 'block' : 'none';
			}
		}
	},
	computed: {
		...mapState('betslip', ['currentType']),
		...mapState('assetsInfo', ['coin']),
		...mapState('betslipStake', ['singleStake', 'multipleStake', 'systemStake',
			'minStake', 'maxStake', 'showCurrency', 'betLoading', 'orderInfo', 'maxBonus', 'maxPotWin']),
		...mapGetters('betslip', ['showBoostTips']),
		...mapGetters('betslipStake', ['stakeUnion']),
		...mapGetters('coupons', ['checkItem']),
		showCoinGroup() {
			return this.coin > 0 && this.currentType !== 'system';
		}
	},
	methods: {
		...mapMutations('betslip', [UPDATE_FAST_MODE]),
		close() {
			this.updateFastMode(false);
		},
		hide() {
			this.$refs.keyboard.showKeyboard = false;
			this.updateCouponsStatus();
		},
		updateCouponsStatus() {
			this.showGift = this.checkItem || this.$refs.keyboard.showKeyboard;
		},
	},
	created() {},
	beforeCreate() {
		// 没有注册Coupons模块
		if (!this.$store._modulesNamespaceMap['coupons/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('coupons', coupons);
		}
	},
	mounted() {
		const numberInput = this.$refs.fastList.$refs.numberInput;
		const keyboard = this.$refs.keyboard;
		if (numberInput && numberInput[0]) {
			numberInput[0].bindKeyboard(this.$refs.keyboard);
			numberInput[0].$on('focus', () => {
				keyboard.showKeyboard = true;
				this.updateCouponsStatus();
			});
			numberInput[0].$on('blur', () => {
				keyboard.showKeyboard = false;
				this.updateCouponsStatus();
			});
		}

		const wrapper = document.querySelector('.m-layout-main');
		if (wrapper) {
			const root = document.createElement('div');
			wrapper.appendChild(root);
			const betLoadingEle = new Vue(BetLoading);
			betLoadingEle.$mount(root);
			this.betLoadingEle = betLoadingEle;
			this.betLoadingEle.$el.style.display = 'none';
		}
	},
	beforeDestroy() {
		const numberInput = this.$refs.fastList.$refs.numberInput;
		if (numberInput && numberInput[0]) {
			numberInput[0].$off('focus');
			numberInput[0].$off('blur');
		}
		if (this.betLoadingEle) {
			this.betLoadingEle.$destroy();
			this.betLoadingEle.$el.remove();
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-fast-betslip {
	box-shadow: 0 -2/@rem 6/@rem 0 rgba(27, 30, 37, 0.3);
	.close-icon {
		position: absolute;
		top: -21/@rem;
		right: 14/@rem;
		width: 58/@rem;
		height: 25/@rem;
		z-index: 1;

		img {
			width: 100%;
			vertical-align: top;
		}
	}
	.boost-tips {
		box-shadow: none;
		border-bottom: 1px solid @dimBlack;
		padding: 8/@rem 15/@rem 7/@rem 15/@rem;
	}
	.i-boost-wrapper {
		margin-top: -2/@rem;
	}
	.boost-left {
		font-size: 12/@rem;
		line-height: 14/@rem;
	}
	.boost-right {
		height: 24/@rem;
		border-radius: 2/@rem;
		line-height: 24/@rem;
	}
	.m-coupons-wrap {
		border-top: 1px solid @lightGray;
		padding: 0 16/@rem;
	}

	.m-fastMode-keyboard.m-keyboard {
		margin-top: 0;
	}

	.m-coupon-wrapper {
		.m-coupon-title {
			height: 36/@rem;
			.m-label, .m-value, .m-text, .m-icon-pack {
				font-size: 14/@rem;
				line-height: 36/@rem;
				height: 36/@rem;
			}
		}
	}

	.m-input{
		display: block;
		.m-input-wrapper{
			padding: 0 16/@rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&>span{
				flex: 1;
				display: block;
			}
			.currency{
				text-align: right;

				em {
					margin-right: 4/@rem;
				}
			}

			.m-bet-sep {
				width: 140/@rem;
				display: inline-block;
				flex: none;
			}

			.bet-count{
				text-align: right;
			}
			.m-keybord-input{
				flex: 0 0 auto;
			}
		}
	}

	.m-market-desc-wrapper {
		.m-input-wrapper {
			padding: 0;
		}

		.m-input .m-error-info {
			padding: 0;
		}

		.m-keybord-input {
			height: 24/@rem;
			width: 80/@rem;
			line-height: 24/@rem;
			box-sizing: border-box;
			margin-bottom: 2/@rem;
		}
	}

	.m-betslip-coin {
		padding-right: 16/@rem;
		padding-bottom: 5/@rem;
	}
}
</style>
