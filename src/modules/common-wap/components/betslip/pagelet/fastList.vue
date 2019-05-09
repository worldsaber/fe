<template>
  <div class="m-fast-bet-outcomes">
	  <!-- outcome列表 -->
	  <div class="m-outcomes-list">
		  <div :class="['m-outcomes-row', {
			  'm-change-item': bet.key === lastChangeItem
		  }]" v-for="bet in betslips" :key="bet.key">
				<div class="m-outcomes-opt" @click="deleteBet(bet.key)"/>
				<div class="m-outcome-right">
					<div class="m-outcomes-row m-team-row">
						<div class="m-team-cell">
							<div class="m-outcome-desc-wrapper">
								<div :class="[bet.icon, 'm-outcome-desc']">{{bet.outcomeInfo.desc}}</div>
								<div class="m-desc"><span>|</span>{{bet.marketInfo.desc}}</div>
								<div class="i-boost" v-if="getBetBoostOdds[bet.key].sptBoost"></div>
								<div class="m-blank"/>
								<template v-if="bet.outcomeInfo.statusDesc !== 'suspended' && bet.outcomeInfo.statusDesc !== 'unavailable'">
  									<div :class="['m-outcome-odds', {
      									'm-outcome-down': bet.outcomeInfo.statusDesc === 'down',
      									'm-outcome-up': bet.outcomeInfo.statusDesc === 'up',
										'm-outcome-del': isBoosting && getBetBoostOdds[bet.key].sptBoost
      								}]">{{bet.outcomeInfo.odds}}</div>
									<div class="m-outcome-boost" v-if="isBoosting && getBetBoostOdds[bet.key].sptBoost">
								 		<NumberChg
											:origin="bet.outcomeInfo.odds"
											:value="getBetBoostOdds[bet.key].showBoostOdds"
											:showChg="needShowBoostingOdds || bet.outcomeInfo.statusDesc === 'down' || bet.outcomeInfo.statusDesc === 'up'"
										/>
									</div>
								</template>
								<div class="m-outcome-suspended m-status-fixed" v-if="bet.outcomeInfo.statusDesc === 'suspended'">Suspended</div>
    							<div class="m-outcome-unavailable m-status-fixed" v-if="bet.outcomeInfo.statusDesc === 'unavailable'">Unavailable</div>
							</div>
							<div class="m-market-desc-wrapper">
								<NumberInput
									ref="numberInput"
									class="m-input"
									:max="maxStake"
									:min="minStake"
									:length="String(maxStake).length"
									:disable="!bet.outcomeInfo.showOdds"
									:value="bet.outcomeInfo.showOdds ? String(singleStake[bet.key] || '') : ''"
									@input="changeSingleStake(bet.key, $event)"
									:placeholder="'min.' + minStake">
									<template slot="inputBefore">
										<div class="m-vs-wrapper">
											<i class="m-icon-live" v-if="bet.marketInfo.product === 1">Live</i>
											<div class="m-vs-desc">{{bet.home}} <span>vs</span> {{bet.away}}</div>
											<div class="m-vs-currency">{{currency}}</div>
										</div>
									</template>
								</NumberInput>
							</div>
						</div>
					</div>
				</div>
		  </div>
	  </div>
  </div>
</template>
<script>
	import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
	import { UPDATE_STAKE } from 'store/betslipStake/mutationTypes';
	import NumberInput from './numberInput.vue';
	import NumberChg from './numberChg.vue';

	export default {
		data () {
			return {
				currency: window.currency,
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
			usingOddsBoost(val) {
				if (val) {
					this.needShowBoostingOdds = true;
				} else {
					this.needShowBoostingOdds = false;
				}
			}
		},
		components: {
			NumberInput,
			NumberChg
		},
		computed: {
			...mapGetters('betslip', ['isBoosting', 'getBetBoostOdds']),
			...mapState('betslip', ['betslips', 'changeOutcomes', 'acceptStatus', 'usingOddsBoost']),
			...mapState('betslipStake', ['singleStake', 'minStake', 'maxStake'])
		},
		methods: {
			...mapActions('betslip', ['deleteBetSlip']),
			...mapMutations('betslipStake', [UPDATE_STAKE]),
			// 删除一个元素
			deleteBet (key) {
				this.deleteBetSlip(key);
			},
			changeSingleStake (key, val) {
				this.updateStake({
					type: 'single',
					stake: {
						[key]: val,
						union: ''
					}
				});
			}
		},
		updated() {
			this.$nextTick(() => {
				if (!this.needShowBoostingOdds) {
					return;
				}

				this.needShowBoostingOdds = false;
			});
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
@import '~base/styles/mixin.less';
.m-fast-bet-outcomes{
	.m-outcomes-list{
		padding-top: 6/@rem;
		>.m-outcomes-row{
			overflow: hidden;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&.m-change-item{
				background-color: #FFE3E5;
			}
			.m-outcomes-opt{
				text-align: center;
				width: 36/@rem;
				flex: 0 0 auto;
				.m-icon-close();
				&:before{
					font-size: 12/@rem;
					color: @midGray;
				}
			}
			.m-outcome-right{
				flex: 1 0 0%;
				overflow: hidden;
			}
			.m-team-row{
				color: @dark;
				// border-bottom: 1px solid @lightGray;
				align-items: center;
				padding-right: 10/@rem;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-content: center;
				align-items: center;
				position: relative;
				align-items: center;
				padding: 8/@rem 10/@rem 8/@rem 0;
				.m-team-cell{
					overflow: hidden;
					flex: 1 0 0%;
					position: relative;
					padding-right: 6/@rem;
					box-sizing: border-box;
					.m-outcome-desc-wrapper,
					.m-vs-wrapper,
					.m-market-desc-wrapper{
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;
						max-width: 100%;
						overflow: hidden;
					}
					.m-outcome-desc-wrapper{
						margin-bottom: 6/@rem;
						font-size: 12/@rem;
						line-height: 18/@rem;
						.m-outcome-desc{
							flex: 0 0 auto;
							max-width: 33%;
							font-size: 14/@rem;
							line-height: 18/@rem;
							font-weight: bold;
							padding-right: 10/@rem;

							&:before{
								padding-right: 5/@rem;
								// display: inline-block;
							}
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.m-outcome-odds{
							flex: 0 0 auto;
							text-align: right;
							white-space: nowrap;
							font-size: 14/@rem;
							font-weight: bold;
							&.m-outcome-up {
								.m-icon-up2();
								&:before{
									font-size: 14/@rem;
									display: inline-block;
									padding-right: 2/@rem;
									color: @green;
								}
							}
							&.m-outcome-down {
								.m-icon-down2();
								&:before{
									font-size: 14/@rem;
									display: inline-block;
									padding-right: 2/@rem;
									color: @red;
								}
							}
							&.m-outcome-del {
								text-decoration: line-through;
								font-size: 12/@rem;
								color: @darkGray;

								&:before {
									content: '';
								}
							}
						}

						.m-outcome-boost {
							flex: 0 0 auto;
							overflow: hidden;
							margin-left: 7/@rem;
						}

						.number-grow-warp {
							height: 18/@rem;
							padding: 1/@rem 3/@rem;
							background: linear-gradient(to right, #40208c, #1e0e53);
							.number-grow {
								font-size: 14/@rem;
							}
						}

						.m-outcome-suspended,
						.m-outcome-unavailable{
							flex: 0 0 auto;
							background-color: @lightGray;
							color: @darkGray;
							border-radius: 2px;
							padding: 0 10/@rem;
							font-size: 10/@rem;
							height: 16/@rem;
							line-height: 16/@rem;
						}

						.m-status-fixed {
							height: 14/@rem;
							line-height: 14/@rem;
						}
					}
					.m-vs-wrapper{
						font-size: 12/@rem;
						.m-icon-live{
							display: block;
							background: @lightGreen;
							color: @dark;
							position: relative;
							margin-right: 5/@rem;
							padding: 0 3/@rem;
							box-sizing: border-box;
							flex: 0 0 auto;
							font-size: 12/@rem;
							height: 14/@rem;
							line-height: 14/@rem;
							&:after {
								position: absolute;
								top: 0;
								right: -2px;
								content: '';
								width: 0;
								height: 0;
								border-top: 8/@rem solid @lightGreen;
								border-left: 1px solid @lightGreen;
								border-right: 1px solid transparent;
								border-bottom: 8/@rem solid transparent;
							}
						}
						.m-vs-desc {
							margin-right: 6/@rem;
							flex: 1;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							span {
								color: @darkGray;
							}
						}
						.m-vs-currency {
							margin-right: 6/@rem;
						}
						// &>div{
						// 	&:nth-of-type(1){
						// 		flex: 0 0 auto;
						// 		padding-right: 10/@rem;
						// 	}
						// 	&:last-child{
						//
						// 	}
						// }
					}
					.m-market-desc-wrapper{
						font-size: 12/@rem;
						align-items: center;
						.m-market-desc{
							flex: 1;
							max-width: ~"calc(100% - " 98/@rem ~")";
							margin-right: 8/@rem;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.m-outcome-suspended,
						.m-outcome-unavailable{
							flex: 0 0 auto;
							background-color: @lightGray;
							color: @darkGray;
							border-radius: 2px;
							padding: 0 10/@rem;
							font-size: 10/@rem;
							height: 16/@rem;
							line-height: 16/@rem;
						}

						.m-input {
							width: 100%;
						}

					}
					.i-boost {
						flex: 0 0 auto;
						width: 16/@rem;
						height: 12/@rem;
						margin-left: 6/@rem;
						background: url(../image/boost.png) no-repeat;
						background-size: contain;
						background-position: center;
					}
					.m-blank {
						flex: 1 1 auto;
					}
					.m-desc {
						max-width: 33%;
						flex: 0 0 auto;
						overflow: hidden;
						font-size: 12/@rem;
						color: @darkGray;
						white-space: nowrap;
						text-overflow: ellipsis;
						span {
							color: @midGray;
							margin-right: 6/@rem;
						}
					}
				}
				.m-outcome-dan-wrapper{
					flex: 0 0 auto;
				}
			}

			&:last-child{
				// border-bottom: 1px solid @lightGray;
				.m-team-row{
					border: 0px;
				}
			}
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
