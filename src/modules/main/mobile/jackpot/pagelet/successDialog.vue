<template>
	<div class="success-dialog-jackpot">
		<h3 class="title">
			<i class="m-icon-suc"></i>Submission Successful!</h3>
		<ul class="list">
			<!-- 不显示id了 -->
			<!-- <li>
				<span>Ticket ID</span>
				<em>{{orderData.shortId||''}}</em>
			</li> -->
			<!-- <li>
				<span>Time</span>
				<em>{{createTime}}</em>
			</li> -->
			<!-- <li>
				<span>Type</span>
				<em>Sporty {{orderData.betType}}</em>
			</li> -->
			<li>
				<span>Round No.</span>
				<em>{{orderData.periodNumber}}</em>
			</li>
			<li>
				<span>Combination<template v-if="orderData.combinations > 1">s</template></span>
				<em>{{orderData.combinations}}</em>
			</li>
			<li>
				<span>Total Stake</span>
				<!-- 去掉单位 -->
				<!-- {{orderData.showCurrency}} -->
				<em>{{totalStake}}</em>
			</li>
			<li v-if="showFavorAmount">
				<!-- 直减红包 -->
				<span v-if="orderData.favorType === 1">Cash Gifts</span>
				<span v-else>Discount Gifts</span>
				<!-- 去掉单位 -->
				<!-- {{orderData.showCurrency}} -->
				<em>{{showFavorAmount}}</em>
			</li>
		</ul>
		<div class="btn-box">
			<span class="btn" @click="close">OK</span>
		</div>
		<div class="jump-box">
			<a :href="jackpotOrder">Check Bet History</a><i></i>
		</div>
		<p class="jackpot-tip">Can't Find Jackpot Bet History? Tap your Avatar - "Jackpot Bet History"</p>
		<a :href="ads.linkUrl" v-if="ads && ads.imgUrl && ads.linkUrl" class="bottomImg">
			<img :src="ads.imgUrl">
		</a>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { getAdConfig } from 'utils/getAdConfig';
import { UPDATE_BET_TATUS } from 'store/jackpot/mutationTypes';
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import { userCenterUrl } from 'config/mycenter/dataConfig';

export default {
	name: 'successDialog',
	data() {
		return {
			jackpotOrder: userCenterUrl.jackpotOrder,
			ads: {}
		};
	},
	created () {
		this.getAd();
	},
	computed: {
		...mapState('jackpot', ['orderData', 'betStatus']),
		createTime() {
			return dateFormat.format(new Date(this.orderData.createTime), 'DD/MM/YYYY');
		},
		totalStake() {
			return formatNumber(+this.orderData.totalStake, 2);
		},
		showFavorAmount () {
			const amount = +this.orderData.favorAmount;
			return amount ? '-' + formatNumber(amount, 2) : '';
		}
	},
	methods: {
		...mapMutations('jackpot', {
			updateBetTatus: UPDATE_BET_TATUS,
		}),
		async getAd () {
			const ads = await getAdConfig('orderSuccess');
			this.ads = ads[0] || {};
		},
		close() {
			this.updateBetTatus('selecting');
			this.$emit('handleClose');
			location.reload();
		}
	}
};
</script>
<style lang="less" scoped>
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import '~base/styles/icon.less';

.success-dialog-jackpot {
	background: @white;
	width: 100%;
	height: 100%;
	display: block;
	position: fixed;
	z-index: 49;
	top: 0;
	left: 0;
	color: @dark;
	overflow: auto;
	.title {
		text-align: center;
		font-size: 16/@rem;
		line-height: 22/@rem;
		padding-bottom: 20/@rem;
		padding-top: 30/@rem;
		.m-icon-suc {
			display: block;
			box-sizing: border-box;
			padding-bottom: 16/@rem;
			.m-icon-success-bg();
			&:after {
				content: '';
				display: inline-block;
				height: 25/@rem;
				width: 32/@rem;
				background: @green;
				position: relative;
				z-index: 10;
				left: -30/@rem;
				vertical-align: middle;
			}
			&:before {
				font-size: 48/@rem;
				left: 9/@rem;
				line-height: 1;
				color: @midGreen;
				position: relative;
				z-index: 11;
				vertical-align: middle;
			}
		}
	}
	.list {
		margin: 0 16/@rem 20/@rem;
		border-top: 1px solid @fogGray;
		border-bottom: 1px solid @fogGray;
		padding: 8/@rem 0;
		li {
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 20/@rem;
			height: 20/@rem;
			font-size: 12/@rem;
			span {
				flex: 1 1 auto;
				text-align: left;
				color: @darkGray;
			}
			em {
				flex: 0 0 auto;
				text-align: right;
				padding-left: 12/@rem;
				display: inline-block;
			}
		}
	}
	.btn{
		width: 80%;
		margin: 0 auto;
		text-align: center;
		background-color: @green;
		display: block;
		height: 48/@rem;
		line-height: 48/@rem;
		font-size: 16/@rem;
		color: @white;
	}
	.jump-box{
		padding: 36/@rem 0 12/@rem 0;
		text-align: center;
		a{
			display: inline-block;
			&:hover,&,&:visited,&:link, &:active{
				color: @midGreen;
				font-size: 14/@rem;
				text-decoration: none;
			}
		}
		i{
			vertical-align: middle;
			display: inline-block;
			padding-left: 10px;
			.m-icon-arrow--right();
			&::before{
				color: @midGreen;
			}
		}
	}
	.jackpot-tip {
		line-height: 16/@rem;
		font-size: 12/@rem;
		color: @darkGray;
		text-align: center;
	}
	.bottomImg{
		margin-top: 21/@rem;
		display: block;
		img{
			width: 100%;
		}
	}
}
</style>
