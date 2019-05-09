<template>
	<div class="bingo-participation">
		<NavBar>
			<homeNav slot="right"/>
		</NavBar>
		<div class="round-info-wrap" v-loading="detailLoading">
			<div class="round-info" @click="goRound">
				<div class="left">
					<div class="round-title">{{roundInfo.goodsDesc}}</div>
					<div class="round-no">Round No. {{roundInfo.roundNo}}</div>
					<div class="round-start-time">Start Time：{{roundInfo.showStartTime}}</div>
					<div class="round-winner-wrap" v-if="roundInfo.phone && roundInfo.winningNo">
						<span class="winner">Winner: {{roundInfo.phone}} </span>
						<span class="winner-no">(Winning No. {{roundInfo.winningNo}})</span>
					</div>
				</div>
				<i class="right arrow-right"/>
			</div>
			<div class="my-part-wrap">
				<img class="parti-win-icon" v-if="isWon" src="../../images/BingoWon@2x.jpg"/>
				<div class="my-part-phone">
					<span class="left" v-if="isMy">My Participation ({{roundInfo.curPhone}})</span>
					<span class="left" v-else>{{roundInfo.curPhone}}</span>
					<div class="right"><span>{{roundInfo.showShare}}</span> {{roundInfo.showShare === 1 ? 'Share' : 'Shares'}}</div>
				</div>
				<div class="my-part-amount">{{currency}} {{roundInfo.showStake}}</div>
			</div>
			<div class="list-item" v-for="(item, index) in list" :key="index">
				<div class="item-wrap status">
					<span class="left">{{item.boughtAmount}} {{item.boughtAmount === 1 ? 'Share' : 'Shares'}}</span>
					<img class="left win-cup" src="../../images/green-cup.svg" v-if="item.numbers.indexOf(+roundInfo.winningNo) > -1">
					<span class="right">{{item.showStatus}}</span>
				</div>
				<div class="item-wrap">
					<span class="left">Time</span>
					<span class="right">{{item.showCreateTime}}</span>
				</div>
				<template v-if="isMy">
					<div class="item-wrap">
						<span class="left">Stake</span>
						<span class="right">{{currency}} {{item.showStake}}</span>
					</div>
					<div class="item-wrap" v-if="item.favorAmount > 0">
						<span class="left">{{item.favorType === 1 ? 'Cash Gift' : 'Discount Gift'}}</span>
						<span class="right">{{item.showFavorAmount}}</span>
					</div>
				</template>
				<div class="item-wrap">
					<span class="left">My No. </span>
					<template v-if="item.numbers && item.numbers.length > 0">
						<span class="left num">{{item.numbers[0]}}</span>
						<span v-if="item.numbers.length > 1" class="left more" @click="toggle(index)">More</span>
					</template>
					<span class="left num" v-else>— —</span>
					<span class="right"></span>
				</div>
				<div class="num-area" v-if="moreTriggers[index]">
					<div :class="['num-wrap', {'win': +num === +roundInfo.winningNo}]" v-for="(num, i) in item.numbers" :key="i">
						<img src="../../images/white-cup.svg" v-if="+num === +roundInfo.winningNo" class="winner-cup">
						<span>{{num}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import NavBar from 'components/navbar';
import homeNav from 'components/homeNav';
import cookie from 'storage/cookie';
import 'components/loading';
import { formatNumber } from 'utils';
// import dateFormat from 'kernel/js/dateFormat';
import { UTCToServer } from '../../js/utils.js';

const curUserId = cookie('userId');
const statusMap = {
	1: '',
	2: 'Pending',
	3: 'Canceled'
};
export default {
	components: {
		NavBar,
		homeNav
	},
	data() {
		return {
			roundInfo: '',
			list: [],
			moreTriggers: [],
			roundId: '',
			userId: '',
			goodsId: '',
			detailLoading: false,
			isWon: false,
			currency: window.currency
		};
	},
	created() {
		const { userId, goodsId } = this.$router.currentRoute.query;
		this.roundId = this.$router.currentRoute.params.id || '';
		this.userId = userId || '';
		this.goodsId = goodsId || '';

		this.getDetail();
	},
	computed: {
		isMy() {
			return curUserId && (curUserId === this.userId);
		},
	},
	methods: {
		goRound() {
			this.$router.push({
				path: `/detail/${this.roundId}`
			});
		},
		toggle(i) {
			this.moreTriggers.splice(i, 1, !this.moreTriggers[i]);
		},
		getDetail() {
			this.detailLoading = true;
			fetch(`/bingowin/goods/period/participant/detail?roundId=${this.roundId}&userId=${this.userId}&goodsId=${this.goodsId}`, {
				methods: 'GET'
			}).then(res => res.json()).then(res => {
				this.detailLoading = false;
				if (res.bizCode === 10000) {
					this.roundInfo = this.formatRound(res.data);
					this.list = this.formatDetail(res.data.entityList);
				} else {
					this.$dialog({
						title: null,
						content: res.message,
						button: ['OK']
					});
				}
			}).catch(() => {
				this.detailLoading = false;
			});
		},
		formatRound(round) {
			this.moreTriggers = [];
			let totalShare = 0,
				totalStake = 0;
			for (let i = 0; i < round.entityList.length; i++) {
				this.moreTriggers.push(false);
				if (round.entityList[i].numbers.indexOf(+round.winningNo) > -1) {
					this.isWon = true;
				}
				round.entityList[i].showStatus = statusMap[round.entityList[i].orderStatus];
				round.entityList[i].showCreateTime = UTCToServer(round.entityList[i].createTime, true);
				round.entityList[i].showFavorAmount = `- ${formatNumber(round.entityList[i].favorAmount / 10000, 0)}`;
				round.entityList[i].showStake = formatNumber(round.entityList[i].stake / 10000, 0);
				if (this.isMy || round.entityList[i].orderStatus === 1) {
					totalShare += round.entityList[i].boughtAmount;
					totalStake += round.entityList[i].stake;
				}
			}
			// round.showStartTime = dateFormat.format(round.startTime, 'DD/MM/YYYY HH:mm:ss');
			round.showStartTime = UTCToServer(round.startTime);
			round.showStake = formatNumber(totalStake / 10000, 0);
			round.showShare = totalShare;
			return round;
		},
		formatDetail(list) {
			if (this.isMy) {
				return list;
			}
			const successList = [];
			list.forEach(item => {
				if (item.orderStatus === 1) {
					successList.push(item);
				}
			});
			return successList;
		},
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.bingo-participation {
	.round-info {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16/@rem;
		border-bottom: 6/@rem solid @lightGray;
		.left {
			flex: 1 1 auto;
		}
		.right {
			flex: 0 0 auto;
		}
		.round-title {
			margin-bottom: 10/@rem;
			line-height: 16/@rem;
			font-size: 14/@rem;
			color: @darker;
		}
		.round-start-time,.round-no {
			line-height: 14/@rem;
			font-size: 12/@rem;
			color: @darkGray;
		}
		.round-winner-wrap {
			line-height: 14/@rem;
			font-size: 12/@rem;
			color: @green;
			.winner {
				margin-right: 6/@rem;
			}
		}
		.arrow-right {
			.m-icon-arrow--right();
		}

	}
	.my-part-wrap {
		padding: 30/@rem 16/@rem 15/@rem 16/@rem;
		position: relative;
		.parti-win-icon {
			position: absolute;
			top: 0;
			right: 0;
			height: 30/@rem;
		}
		.my-part-phone {
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 20/@rem;
			font-size: 14/@rem;
			.left {
				flex: 1 1 auto;
			}
			.right {
				flex: 0 0 auto;
				span {
					color: @darker;
					font-weight: bold;
				}
			}
		}
		.my-part-amount {
			line-height: 14/@rem;
			font-size: 12/@rem;
			color: @darkGray;
			text-align: right;
		}
	}
	.list-item {
		border-top: 1px solid @lightGray;
		padding: 12/@rem 16/@rem;

		.item-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 14/@rem;
			font-size: 12/@rem;
			color: @darkGray;
			.left {
				flex: 0 0 auto;
				margin-right: 6/@rem;
				&.num {
					color: @dark;
				}
				&.more {
					color: @green;
				}
			}
			.right {
				flex: 1 1 auto;
				text-align: right;
			}

			&.status {
				margin-bottom: 6/@rem;
				line-height: 16/@rem;
				font-weight: 500;
				.left {
					font-size: 14/@rem;
					color: @darker;
				}
				.right {
					font-size: 12/@rem;
					color: @dark;
				}
			}
		}
		.num-area {
			.num-wrap {
				display: inline-block;
				vertical-align: middle;
				min-width: 30/@rem;
				text-align: center;
				margin-right: 4/@rem;
				margin-top: 10/@rem;
				padding: 0 10/@rem;
				border-radius: 12/@rem;
				line-height: 24/@rem;
				background-color: @fogGray;
				.winner-cup {
					vertical-align: middle;
				}
				span {
					vertical-align: middle;
				}
				&.win {
					background-color: @green;
					color: @white;
				}
			}
		}
	}
}

</style>
