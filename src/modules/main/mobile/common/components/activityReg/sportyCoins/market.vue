<template>
	<div class="sporty-coins-market-wrapper">
		<!-- 拉取比赛失败时显示 -->
		<div class="no-game" v-if="!marketData">
			<img src="../image/banner-ke.jpg" v-if="country==='ke'">
			<img src="../image/banner-ng.jpg" v-if="country==='ng'">
			<img src="../image/banner-gh.jpg" v-if="country==='gh'">
			<i></i>
			<p>Failed to load the match.</p>
			<div class="btn" @click="reload">Try Again</div>
		</div>
		<!-- 不同国家切换不同背景 -->
		<div :class="['has-game',{'wrapper-ke':country==='ke'},{'wrapper-ng':country==='ng'},{'wrapper-gh':country==='gh'}]" v-else>
			<div class="tournament-area">
				<p v-if="marketData.sport">{{marketData.sport.category.name}} - {{marketData.sport.category.tournament.name}}</p>
				<p>{{marketData.estimateStartTime}}</p>
			</div>
			<div class="teams-area">
				<div class="home">
					<p class="side">Home Team</p>
					<p class="team">{{marketData.homeTeamName}}</p>
				</div>
				<div class="right-triangle"></div>
				<div class="vs">VS</div>
				<div class="left-triangle"></div>
				<div class="away">
					<p class="side">Away Team</p>
					<p class="team">{{marketData.awayTeamName}}</p>
				</div>
			</div>
			<div class="bet-area">
				<p class="note">Select your prediction for the result of the match:</p>
				<div class="markets" v-if="marketData.markets">
					<div v-for="(item, i) in marketData.markets[0].outcomes" :key="i" @click="pickMarket(item)" :class="{'selected':item.isSelected}">
						<p v-if="i===0">Home</p>
						<p v-if="i===1">Draw</p>
						<p v-if="i===2">Away</p>
						<p class="odds">{{item.odds}}</p>
					</div>
				</div>
				<!-- 若未投注时点击按钮，显示该条错误提示 -->
				<p v-if="showErr" class="error">Place choose the result you predict first.</p>
				<div :class="['bet-btn', {'within-potential-win':potentialWin>0}]">
					<p @click="goToReg">Place Bet</p>
					<p class="potential-win" v-if="potentialWin>0">(Potential Win: {{currency}} {{potentialWin}})</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { UPDATE_ORDER_PARAMS, CLEAR_SELECTION } from 'store/activityRegister/mutationTypes';
import { formatNumber } from 'utils';

export default {
	data() {
		return {
			currency: window.currency,
			country: window.country,
			potentialWin: 0,
			showErr: false,
			noData: false,
			stakeMap: {
				ke: 50,
				ng: 100,
				gh: 1
			}
		};
	},
	computed: {
		...mapState('activityRegister', [
			'marketData',
		]),
	},
	created() {
		this.fetchMarketData().then(() => {
			document.querySelector('#pageLoading').style.display = 'none';
		}).catch(e => {
			document.querySelector('#pageLoading').style.display = 'none';
		});
	},

	methods: {
		...mapActions('activityRegister', [
			'fetchMarketData',
		]),
		...mapMutations('activityRegister', {
			updateOrderParams: UPDATE_ORDER_PARAMS, // 每次选择后，更新后续页面所需数据
			clearSelection: CLEAR_SELECTION // 每次选择后，清空之前所选
		}),
		goToReg() { // 点击按钮后，校验是否投注，否报错，是进入注册页
			if (!this.potentialWin) {
				this.showErr = true;
				return;
			}
			this.$emit('toReg');
		},
		pickMarket(item) { // 选择时计算potentialWin，更新传入下个页面的数据
			this.showErr = false;
			this.potentialWin = formatNumber((item.odds * this.stakeMap[this.country]), 2);
			this.clearSelection();
			item.isSelected = true;
			this.updateOrderParams({
				odds: item.odds,  // 生单所需
				id: item.id, // 生单所需
				potentialWin: this.potentialWin, // 注册页展示所需
				desc: item.desc // 注册页展示所需
			});
		},
		reload() {
			location.reload();
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import 'base/styles/icon.less';
	.sporty-coins-market-wrapper {
		.no-game {
			color: @darkGray;
			text-align: center;
			img {
				width: 100%;
			}
			i {
				display: block;
				margin-top: 48/@rem;
				margin-bottom: 18/@rem;
				.m-icon-exclamation();
				&:before {
					font-size: 36/@rem;
				}
			}
			p {
				font-size: 14/@rem;
			}
			div {
				margin: 0 auto;
				width: 197px;
				height: 48px;
				line-height: 48px;
				border-radius: 2px;
				color: @green;
				border: solid 1px;
				text-align: center;
				margin-top: 26/@rem;
				margin-bottom: 64/@rem;
				font-size: 16px;
  				font-weight: bold;
			}
		}
		.wrapper-ke {
		background: url(../image/bg-ke.jpg) no-repeat;
		}
		.wrapper-ng {
			background: url(../image/bg-ng.jpg) no-repeat;
		}
		.wrapper-gh {
			background: url(../image/bg-gh.jpg) no-repeat;
		}
		.has-game {
			padding-bottom: 29/@rem;
			background-size: cover;
			.tournament-area {
				padding-top: 100/@rem;
				text-align: center;
				color: #a70e06;
			}
			.teams-area {
				margin-top: 6/@rem;
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				color: #fff;
				text-align: center;
				.side {
					font-size: 12/@rem;
					color: #ffcecf;
				}
				.team {
					font-size: 14/@rem;
				}
				.home {
					width: 145/@rem;
					height: 47/@rem;
					line-height: 1.5;
					border-radius: 100/@rem;
					box-shadow: 0 1/@rem 1/@rem 0 rgba(123, 0, 0, 0.5);
					background-image: linear-gradient(305deg, #c90f04, #790c08);
					border-bottom-right-radius: unset;
					border-top-right-radius: unset;
					
				}
				.right-triangle {
						border-right: 30/@rem solid transparent; 
						border-bottom: 51/@rem solid #000;;
						opacity: 0.14;
					}
				.vs {
					width: 20/@rem;
					height: 20/@rem;
					line-height: 20/@rem;
					border-radius: 50%;
					background-image: radial-gradient(circle at 50% 50%, #f6ad0c, #f95909);
					margin-left: -25/@rem;
					margin-right: -25/@rem;
					position: relative;
					z-index: 2;
				}
				.left-triangle {
						border-left: 30/@rem solid transparent; 
						border-top: 47/@rem solid #000;;
						opacity: 0.44;
					}
				.away {
					width: 144/@rem;
					height: 47/@rem;
					line-height: 1.5;
					border-radius: 100/@rem;
					border-bottom-left-radius: unset;
					border-top-left-radius: unset;
					box-shadow: 0 1/@rem 1/@rem 0 rgba(123, 0, 0, 0.5);
					background-image: linear-gradient(303deg, #c90f04, #790c08);
				}
			}
			.bet-area {
				background: #fff;
				margin: 12/@rem 17/@rem 0;
				padding: 0 9/@rem 15/@rem 13/@rem;
				.note {
					padding-top: 14/@rem;
					margin-bottom: 9/@rem;
					color: #4a4a4a
				}
				.markets {
					display: flex;
					flex-flow: row nowrap;
					justify-content: center;
					.selected {
						background: #73ef96;
					}
					div {
						width: 98/@rem;
						height: 48/@rem;
						background-color: #d6ebdc;
						margin-right: 2/@rem;
						text-align: center;
						line-height: 1.7;
						color: #096b27;
						.odds {
							font-size: 16/@rem;
							font-weight: bold;
						}
					}
				}
				.error {
					margin-top: 5/@rem;
					color: @red;
				}
				.bet-btn {
					color: #fff;
					font-size: 16/@rem;
					font-weight: bold;
					text-align: center;
					height: 48/@rem;
					line-height: 48/@rem;
					border-radius: 2/@rem;
					background: #0d9737;
					margin-top: 22/@rem;
					
				}
				.within-potential-win {
					display: flex;
					flex-flow: column;
					height: 44/@rem;
					padding-top: 4/@rem;
					line-height: unset;
					.potential-win {
						font-size: 12/@rem;
						font-weight: 100;
					}
				}
			}
		}
	}
</style>
