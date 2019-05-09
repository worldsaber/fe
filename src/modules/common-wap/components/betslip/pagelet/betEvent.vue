<template>
	<div :class="['m-outcomes-row', {
		'm-change-item': bet.key === lastChangeItem,
		'is-boost-item': isBoosting && isShowOdds && isSptBoost
	}]">
		<!-- delete btn -->
		<div class="m-outcomes-opt" @click="deleteBet">
			<div class="m-outcomes-color" :style="colorStyle" v-if="currentType !== 'single'"></div>
		</div>
		<div class="m-outcome-right">
			<div class="m-outcomes-row m-team-row">
				<div class="m-team-cell">
					<a :href="detailLink">
						<div class="m-outcome-desc-wrapper">
							<div :class="[bet.icon, 'm-outcome-desc']">{{bet.outcomeInfo.desc}}</div>

							<template v-if="!isSuspended && !isUnavailable">
								<div :class="['m-outcome-odds', {
									'm-outcome-down': isOddsDown,
									'm-outcome-up': isOddsUp,
									'm-outcome-del': isBoosting && isSptBoost
								}]">{{bet.outcomeInfo.odds}}</div>

								<div class="m-outcome-boost" v-if="isBoosting && isSptBoost">
									<NumberChg
										:origin="bet.outcomeInfo.odds"
										:value="betBoostOdds.showBoostOdds"
										:showChg="isShowChg"
									/>
								</div>
							</template>

							<template v-if="currentType === 'single'">
								<div class="m-outcome-suspended m-status-fixed" v-if="isSuspended">Suspended</div>
								<div class="m-outcome-unavailable m-status-fixed" v-if="isUnavailable">Unavailable</div>
							</template>
						</div>

						<div class="m-vs-wrapper">
							<i class="m-icon-live" v-if="isLive">Live</i>
							<div>{{bet.gameId}}</div>
							<div>{{bet.home}} vs {{bet.away}}</div>
						</div>
					</a>

					<div class="m-market-desc-wrapper">
						<template v-if="currentType !== 'single'">
							<div class="m-market-desc">{{bet.marketInfo.desc}}</div>
							<div class="m-outcome-suspended" v-if="isSuspended">Suspended</div>
							<div class="m-outcome-unavailable" v-if="isUnavailable">Unavailable</div>
						</template>

						<template v-else>
							<NumberInput
								class="m-input"
								:max="maxStake"
								:min="minStake"
								:disable="!isShowOdds"
								:value="isShowOdds ? String(singleStake[bet.key] || '') : ''"
								@input="changeSingleStake(bet.key, $event)"
								:placeholder="'min.' + minStake">
								<template slot="inputBefore">
									<div class="m-market-desc">
										<div class="m-desc">{{bet.marketInfo.desc}}</div>
										<div class="i-boost" v-if="isSptBoost"></div>
									</div>
								</template>
							</NumberInput>
						</template>
					</div>
				</div>
				<!-- 支持胆码就显示 -->
				<div class="m-outcome-dan-wrapper" v-if="supportBanker && bankerStatus">
					<Banker :id='bet.key'/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* 单个的 bet list item, 即每个 bet event 比赛信息 */
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import { UPDATE_STAKE } from 'store/betslipStake/mutationTypes';
import { baseUrl } from 'config/pageConfig';
import NumberChg from './numberChg.vue';
import NumberInput from './numberInput.vue';
import Banker from './banker';

export default {
	name: 'BetEvent',
	components: {
		NumberChg,
		NumberInput,
		Banker
	},
	props: {
		bet: {
			type: Object,
			required: true
		},
		lastChangeItem: {
			type: String,
			'default': ''
		},
		needShowBoostingOdds: {
			type: Boolean,
			'default': false
		}
	},
	computed: {
		...mapGetters('betslip', ['isBoosting', 'getBetBoostOdds', 'supportBanker']),
		...mapState('betslip', ['colorEventOrder', 'colors', 'currentType', 'bankerStatus']),
		...mapState('betslipStake', ['singleStake', 'minStake', 'maxStake']),
		colorsMap () {
			return this.colorEventOrder.reduce((res, cur, index) => {
				res[cur] = this.colors[index];
				return res;
			}, {});
		},
		colorStyle () {
			const { eventId } = this.bet;
			return this.colorsMap[eventId] ? {
				backgroundColor: this.colorsMap[eventId]
			} : {};
		},
		betBoostOdds () {
			return this.getBetBoostOdds[this.bet.key];
		},
		isSptBoost () {
			return !!this.betBoostOdds && this.betBoostOdds.sptBoost;
		},
		isLive () {
			return this.bet.marketInfo.product === 1;
		},
		detailLink () {
			const { sportName, categoryId, tournamentId, eventId } = this.bet;
			let url = '';
			if (this.isLive) {
				// live
				url = `${baseUrl}sport/${sportName}/live/${categoryId}/${tournamentId}/${eventId}`;
			} else {
				// 比赛没有开始，跳转到 pre match的详情页面
				url = `${baseUrl}sport/${sportName}/${categoryId}/${tournamentId}/${eventId}`;
			}
			return url;
		},
		// odds down
		isOddsDown () {
			return this.bet.outcomeInfo.statusDesc === 'down';
		},
		// odds up
		isOddsUp () {
			return this.bet.outcomeInfo.statusDesc === 'up';
		},
		isUnavailable () {
			return this.bet.outcomeInfo.statusDesc === 'unavailable';
		},
		isSuspended () {
			return this.bet.outcomeInfo.statusDesc === 'suspended';
		},
		isShowChg () {
			return this.needShowBoostingOdds || this.isOddsDown || this.isOddsUp;
		},
		isShowOdds () {
			return this.bet.outcomeInfo.showOdds;
		}
	},
	methods: {
		...mapActions('betslip', ['deleteBetSlip']),
		...mapMutations('betslipStake', {
			updateStake: UPDATE_STAKE
		}),
		// 删除一个元素
		deleteBet () {
			this.deleteBetSlip(this.bet.key);
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
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
@import '~base/styles/mixin.less';

.m-outcomes-row{
	overflow: hidden;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	&.m-change-item{
		background-color: #FFE3E5;
	}
	.m-outcomes-color {
		width: 3px;
		position: absolute;
		height: 100%;
		left:0;
		top:0;
	}
	.m-outcomes-opt{
		text-align: center;
		width: 36/@rem;
		flex: 0 0 auto;
		.m-icon-close();
		&:before{
			font-size: 16/@rem;
		}
	}
	.m-outcome-right{
		flex: 1 0 0%;
		overflow: hidden;
	}
	.m-team-row{
		color: @dark;
		border-bottom: 1px solid @lightGray;
		align-items: center;
		padding-right: 10/@rem;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-content: center;
		align-items: center;
		position: relative;
		align-items: center;
		padding: 5/@rem 10/@rem 5/@rem 0;

		.m-team-cell{
			overflow: hidden;
			flex: 1 0 0%;
			position: relative;
			padding-right: 10/@rem;
			box-sizing: border-box;

			& > a {
				display: block;
				color: @dark;
			}

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
				font-size: 16/@rem;
				.m-outcome-desc{
					flex: 1 1 0%;
					padding-right: 10/@rem;
					&:before{
						padding-right: 5/@rem;
						display: inline-block;
					}
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.m-outcome-odds{
					white-space: nowrap;
					&.m-outcome-up {
						.m-icon-up2();
						&:before{
							display: inline-block;
							padding-right: 10/@rem;
							color: @green;
						}
					}
					&.m-outcome-down {
						.m-icon-down2();
						&:before{
							display: inline-block;
							padding-right: 10/@rem;
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
					flex: 0 0 auto;
				}

				.m-outcome-boost {
					flex: 0 0 auto;
					overflow: hidden;
					margin-left: 7/@rem;
				}

				.number-grow-warp {
					font-size: 16/@rem;
					height: 20/@rem;
					line-height: 20/@rem;
					padding: 1/@rem 3/@rem;
					background: linear-gradient(to right, #40208c, #1e0e53);
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
				font-size: 14/@rem;
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
					height: 16/@rem;
					line-height: 16/@rem;
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
				&>div{
					&:nth-of-type(1){
						flex: 0 0 auto;
						padding-right: 10/@rem;
					}
					&:last-child{
						flex: 1;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
			.m-market-desc-wrapper{
				font-size: 14/@rem;
				align-items: center;
				.m-market-desc{
					flex: 1;
					max-width: ~"calc(100% - " 98/@rem ~")";
					margin-right: 8/@rem;
				}
				.m-desc {
					display: inline-block;
					vertical-align: middle;
					max-width: ~"calc(100% - " 20/@rem ~")";
					overflow: hidden;
					white-space: nowrap;
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

				.i-boost {
					display: inline-block;
					vertical-align: middle;
					width: 16/@rem;
					height: 12/@rem;
					margin-left: 4/@rem;
					background: url(../image/boost.png) no-repeat;
					background-size: contain;
					background-position: center;
				}
			}
		}
		.m-outcome-dan-wrapper{
			flex: 0 0 auto;
		}
	}

	&:last-child{
		border-bottom: 1px solid @lightGray;
		.m-team-row{
			border: 0px;
		}
	}
}
</style>
