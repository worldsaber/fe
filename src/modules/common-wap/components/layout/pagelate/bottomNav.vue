<template>
<div class="m-bottom-nav">
	<div class="m-bottom-fixed" v-if="!fastMode">
		<!-- <div class="m-cashout-btn m-btn-button" @click="jumpToCashout">Cashout<span v-if="cashoutCount > 0">{{showCashoutCount}}</span></div> -->
		<div class="m-openbet-btn m-btn-button" @click="jumpToOpenbet">Open Bets<span v-if="unsettleCount > 0">{{unsettleCount}}</span>
			<div class="m-bets-tips" v-if="showOpenBetTips"><div class="m-txt">Check Cashout and Bet History here</div><i class="m-i-close" @click.stop="hideOpenbetTips"></i></div>
		</div>
		<div class="m-Betslip-btn m-btn-button" @click="handleBetslip">Betslip
			<span :class="['m-bet-count', {
				'm-anime-scale': betCountChanged
			}]" v-if="betCount > 0">{{betCount}}</span>
		</div>
	</div>
	<transition name="slide" @after-enter="fastBetslipAfterEnter">
		<div class="m-fast-betslip-wrap" v-if="fastMode">
			<fastBetslip class="m-fast-betslip"/>
		</div>
	</transition>
</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus.js';
import {
	TOGGLE_RIGHT
} from 'store/layout/mutationTypes';
import {
	mapMutations,
	mapGetters,
	mapState
} from 'vuex';
import {
	pagePath
} from 'config/pageConfig';
import {
	LS
} from 'storage';
// import cashoutCount from 'components/cashout/js/cashoutCountMixin';
import unsettleBetCount from 'components/openbet/openbetMixin';
import fastBetslip from 'components/betslip/fastBetslip';

export default {
	mixins: [
		// cashoutCount,
		unsettleBetCount
	],
	components: {
		fastBetslip
	},
	data() {
		return {
			showOpenBetTips: 0,
			betCountChanged: false
		};
	},
	computed: {
		...mapGetters('betslip', ['betCount']),
		...mapState('betslip', ['fastMode'])
	},
	watch: {
		betCount(val, oldVal) {
			if (val !== oldVal) {
				this.betCountChanged = true;
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.betCountChanged = false;
				}, 200);
			}
		}
	},
	methods: {
		...mapMutations('layout', [TOGGLE_RIGHT]),
		handleBetslip() {
			// if (this.betCount > 0) {
			// 	this.toggleRight();
			// } else {
			// 	this.$toast('please choose some games');
			// }
			this.toggleRight();
		},
		// jumpToCashout() {
		// 	location.href = pagePath.cashout;
		// },
		jumpToOpenbet() {
			location.href = pagePath.openbet;
		},
		hideOpenbetTips() {
			this.showOpenBetTips = 0;
			LS.set('h5_openbet_tip', 0);
		},
		fastBetslipAfterEnter () {
			EventBus.$emit('fastBetslipAfterEnter');
		},
	},
	created() {
		let openBetStatus = LS.get('h5_openbet_tip');
		openBetStatus = openBetStatus ? +openBetStatus : 1;
		this.showOpenBetTips = openBetStatus;

		window.addEventListener('unload', () => {
			this.showOpenBetTips && LS.set('h5_openbet_tip', 0);
		});

		// this.getCashoutCount();
		window.loginStatus && this.getUnsettleBetsCount();
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-bottom-nav {
    .m-fast-betslip-wrap {
        position: fixed;
		padding-top: 16/@rem;
        bottom: 0;
        width: 100%;
        display: flex;
        z-index: 222;
		.m-fast-betslip {
			position: relative;
			background-color: @white;
			width: 100%;
		}
    }
    .m-bottom-fixed {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        padding: 7/@rem 10/@rem;
        background-color: @white;
        // background-color: fade(@blueBlack, 95%);
        box-sizing: border-box;
        z-index: 222;
        .m-btn-button {
            flex: 1;
            height: 35/@rem;
            line-height: 35/@rem;
            color: @white;
            text-align: center;
            font-size: 16/@rem;
            border-radius: 2/@rem;
            // &.m-cashout-btn,
			&.m-openbet-btn {
                background-color: @black;
                margin-right: 2px;
				position: relative;

                & > span {
                    border-radius: 50%;
                    background-color: fade(@fogGray, 20%);
                    display: inline-block;
                    margin-left: 3/@rem;
                    height: 24/@rem;
                    min-width: 24/@rem;
                    vertical-align: middle;
                    line-height: 1.5;
                }

				.m-bets-tips {
					position: absolute;
					top: 1/@rem;
					left: 0;

					background: transparent url(../image/popTips.svg) no-repeat;
					background-position: left center;
					background-size: 166/@rem auto;
					color: @white;

					display: table;
					display: flex;

					transform: translate3d(0,-100%,0);
    				width: 166/@rem;
				}

				.m-txt,
				.m-i-close {
					display: table-cell;
					vertical-align: top;
				}

				.m-txt {
					flex: 1;
					min-width: 1%;

					font-size: 14/@rem;
					line-height: 16/@rem;
					font-weight: 500;
					padding: 7/@rem 0 7/@rem 8/@rem;
				    box-sizing: border-box;
				}

				.m-i-close {
					.m-icon-close();
					text-align: right;
					padding: 7/@rem 10/@rem 7/@rem 7/@rem;
					box-sizing: border-box;
					margin-top: -2/@rem;

					&:before {
						font-size: 10/@rem;
						line-height: 1;
					}
				}
            }
            &.m-Betslip-btn {
                background-color: @green;
                margin-left: 2px;
                & > span {
                    border-radius: 50%;
                    background-color: fade(@black, 20%);
                    display: inline-block;
                    margin-left: 3/@rem;
                    height: 24/@rem;
                    min-width: 24/@rem;
                    vertical-align: middle;
                    line-height: 1.5;
                }
            }
        }
    }

	.slide-enter-active, .slide-leave-active {
		transition: all .3s ease;
	}
	.slide-enter, .slide-leave-to {
		transform: translateY(100%);
	}

	.m-bet-count {
		transition: all .1s ease;
	}
	.m-anime-scale {
		transform: scale(1.4);
	}
}
</style>
