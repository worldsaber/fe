<template>
	<div :class="['boost-tips', `boost-tips--${type}`]" ref="j_boostWrap">
		<div class="boost-left">{{descText}}</div>
		<div :class="['boost-right', {
			boosted: usingOddsBoost,
			disabled: disabled
		}]" @click="updateBoostStatus">
			<div class="m-boost-btn-left">
				<span class="m-boost-checkbox"></span>
				<span class="boost-text">{{getOddsBoosText}}</span>
			</div>
			<!-- 图标 -->
			<IconBoostPointer
				class="m-icon-boost-pointer"
				:playing="canAnimate || startCanAnimate"
				:active="usingOddsBoost"
				:start="!hasBoostTips"
				@end="transitionEnd" />
		</div>

		<!-- 首次进入带有Booster的Betslip，提示首次引导 -->
		<div class="m-guide-mask" v-if="guideVisible">
			<div class="m-guide-mask--blank" :style="guideBlankStyle"></div>
			<div class="m-guide-mask--main" :style="guideMainStyle">
				<div class="m-guide-arrow-pic">
					<template v-if="type === 'fast'">
						<!-- 箭头指示图, 朝下 -->
						<svg xmlns="http://www.w3.org/2000/svg" width="45" height="81" viewBox="0 0 45 81">
							<g fill="none" fill-rule="nonzero">
								<path stroke="#FFF" stroke-dasharray="5,2" d="M.986.788c7.276 3.679 12.133 7.41 14.572 11.195 10.126 15.712 6.835 13.862 5.826 17.874-.59 2.345-7.945 4.506-9.484 0-1.539-4.506 3.392-7.05 10.2-5.453 6.808 1.597 17.372 14.73 18.924 26.15 1.034 7.613 1.034 15.428 0 23.446"/>
								<path fill="#FFF" d="M40.732 81L37 72.252h7.663z"/>
							</g>
						</svg>
					</template>

					<template v-else>
						<!-- 箭头指示图, 朝上 -->
						<svg xmlns="http://www.w3.org/2000/svg" width="49" height="56" viewBox="0 0 49 56">
							<g fill="none" fill-rule="nonzero">
								<path stroke="#FFF" stroke-dasharray="5,2" d="M.296 54.778c17.474-5.357 26.807-10.377 28-15.06 1.788-7.023-5.618-5.814-7.157-2.436-1.539 3.378 1.065 7.722 7.873 6.524 6.808-1.197 14.013-12.863 15.012-18.355.666-3.662 1-9.812 1-18.451"/>
								<path fill="#FFF" d="M44.732 0L41 8.748h7.663z"/>
							</g>
						</svg>
					</template>
				</div>

				<div class="m-guide-main">
					<p class="m-desc">Tap to boost your odds <br /> and Potential Winnings</p>
					<button class="m-btn" @click="closeGuide">Got it</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus.js';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { UPDATE_ODDS_BOOST_STATUS } from 'store/betslip/mutationTypes';
import { LS } from 'storage';
import IconBoostPointer from './IconBoostPointer.vue';

const hasBoostStartTips = LS.get('h5_betslip_boost') || '0';
const hasGotBoostGuide = LS.get('h5_betslip_boost_guide');

export default {
	name: 'OddsBoostTip',
	components: {
		IconBoostPointer
	},
	props: {
		// 当前应用类型，目前有两个值: fast - 快速投注; normal - betslip
		type: {
			type: String,
			'default': 'normal'
		},
		// 外部因素导致 dom 结构变化，需重新计算 style
		changed: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			canAnimate: false,
			startCanAnimate: false,
			hasBoostTips: !!+hasBoostStartTips,
			guideVisible: !hasGotBoostGuide,
			guideRectData: null
		};
	},
	computed: {
		...mapState('betslip', ['usingOddsBoost', 'betslips']),
		...mapGetters('betslip', ['getBetBoostOdds']),
		descText() {
			if (this.disabled) {
				return 'No games available to boost';
			}
			return 'Live Odds Boost';
		},
		getOddsBoosText() {
			const usingOddsBoost = this.usingOddsBoost || false;

			if (usingOddsBoost) {
				return 'BOOSTED';
			}

			return 'BOOST';
		},
		// 当所有 live odds boost 比赛 market 时，控件显示不可点状态
		disabled() {
			return this.betslips
				.filter(x => {
					const betBoostOdds = this.getBetBoostOdds[x.key];
					return !!betBoostOdds && betBoostOdds.sptBoost;
				})
				.every(({ marketInfo = {}}) => (
					// market的状态，0表示live，1表示suspended，2表示deactived 3表示settled
					[1, 2, 3].includes(marketInfo.status)
				));
		},
		// 需要对 betslip 和 fastBetslip 分别进行计算样式
		guideBlankStyle() {
			const style = {};
			if (this.guideRectData) {
				const { top, height } = this.guideRectData;
				const documentHeight = document.documentElement.clientHeight;
				if (top <= documentHeight / 2) {
					style.height = `${top}px`;
					style.top = 0;
				} else {
					const t = top + height;
					style.top = `${t}px`;
					style.height = `${documentHeight - t}px`;
				}
			}
			return style;
		},
		guideMainStyle() {
			const style = {};
			if (this.guideRectData) {
				const { top, height } = this.guideRectData;
				const documentHeight = document.documentElement.clientHeight;
				if (top <= documentHeight / 2) {
					style.top = `${top + height}px`;
				} else {
					style.top = 0;
					style.height = `${top}px`;
				}
			}
			return style;
		},
	},
	methods: {
		...mapMutations('betslip', {
			updateOddsBoostStatus: UPDATE_ODDS_BOOST_STATUS
		}),
		updateBoostStatus() {
			if (this.disabled) {
				return;
			}

			if (this.canAnimate) {
				return;
			}

			this.updateOddsBoostStatus(!this.usingOddsBoost);
			this.canAnimate = true;

			this.closeGuide();
		},
		transitionEnd() {
			if (this.canAnimate) {
				this.canAnimate = false;
			}

			if (this.startCanAnimate) {
				this.startCanAnimate = false;
				this.hasBoostTips = true;
				LS.set('h5_betslip_boost', '1');
			}
		},
		getStyle() {
			// 由于 fastBetslip 和 betslip 都有引导, 所以此处需要重新取值
			this.guideVisible = !LS.get('h5_betslip_boost_guide');
			if (!this.guideVisible) return;
			const BoostTipsEl = this.$refs.j_boostWrap;
			if (BoostTipsEl) {
				this.guideRectData = BoostTipsEl.getBoundingClientRect() || {};
			}
		},
		closeGuide() {
			this.guideVisible = false;
			LS.set('h5_betslip_boost_guide', 1);
		}
	},
	watch: {
		changed(val) {
			if (val) {
				this.getStyle();
			}
		}
	},
	mounted() {
		if (this.type !== 'fast') {
			this.getStyle();
		}

		// 快速投注界面存在入场动画，需要等动画结束后重新计算位置
		EventBus.$once('fastBetslipAfterEnter', () => {
			this.getStyle();
		});
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.boost-tips {
	background: @white;
	width: 100%;
	padding: 9/@rem 15/@rem;
	box-sizing: border-box;

	display: table;
	display: flex;
	display: grid;

	grid-template-columns: 1fr 120/@rem;
	align-items: center;
	box-shadow: 0 0 2px 2px fadeout(@black, 80%);
}

.boost-right,
.boost-left {
	display: table-cell;
	vertical-align: middle;
}

.boost-left {
	flex: 1;
	min-width: 1%;
	padding-right: 5/@rem;
	box-sizing: border-box;
	font-size: 14/@rem;
	line-height: 1;
	color: @darker;
}

.boost-right {
	flex: auto;
	width: 120/@rem;
	height: 32/@rem;
	line-height: 32/@rem;
	border-radius: 2/@rem;
	padding: 0 8/@rem;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #200f57 linear-gradient(to right, #200f57, #1e0e53);
	color: @white;
	font-size: 0;

	&.boosted {
		background: #40208c linear-gradient(to right, #40208c, #1e0e53);

		.m-boost-btn-left {
			.m-boost-checkbox {
				.m-icon-success();

				&:before {
					font-size: 10/@rem;
					line-height: 14/@rem;
					font-weight: bold;
					color: #40208c;
				}
			}
		}
	}

	&.disabled {
		background: #9ca0ab;

		.i-pointer {
			.icon-pointer {
				background: #9ca0ab;
			}
		}
		// 指针颜色
		#pointer-render {
			fill: #fff;
		}
	}
}

.m-boost-btn-left,
.boost-text,
.i-boost-wrapper,
.m-boost-checkbox {
	display: inline-block;
	vertical-align: middle;
}

.m-boost-btn-left {
	.m-boost-checkbox {
		display: inline-block;
		width: 14/@rem;
		height: 14/@rem;
		line-height: 14/@rem;
		text-align: center;
		border-radius: 1/@rem;
		background: @white;
		position: relative;
	}

	.boost-text {
		margin-left: 6/@rem;
		font-size: 12/@rem;
		font-weight: 500;
		line-height: 14/@rem;
		text-align: center;
	}
}

.m-icon-boost-pointer {
	margin-left: 4/@rem;
}

// 引导样式
.m-guide-mask {
	.m-guide-arrow-pic {
		position: absolute;
		right: 56/@rem;
		margin-top: 12/@rem;
	}

	.m-guide-main {
		text-align: center;
		margin: 48/@rem 122/@rem 0 63/@rem;
	}

	.m-desc {
		font-size: 16/@rem;
		font-weight: 500;
		line-height: 22/@rem;
	}

	.m-btn {
		margin-top: 18/@rem;
		width: 140/@rem;
		height: 34/@rem;
		border-radius: 4/@rem;
		border: 1px solid #fff;
		font-size: 16/@rem;
		font-weight: 500;
		color: #fff;
		background: transparent;;
	}

	.m-guide-mask--blank {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background: rgba(0, 0, 0, 0.7);
	}

	.m-guide-mask--main {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		color: #fff;
		background: rgba(0, 0, 0, 0.7);
	}
}

.boost-tips--fast {
	.m-guide-mask {
		.m-guide-mask--main {
			.m-guide-main {
				position: absolute;
				bottom: 32/@rem;
				margin: 0 0 0 83/@rem;
			}
			.m-guide-arrow-pic {
				position: absolute;
				bottom: 11/@rem;
				right: 45/@rem;
			}
		}
	}
}
</style>
