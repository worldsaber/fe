<template>
	<div class="success-dialog">
		<h3 class="title">
			<i class="m-icon-suc"></i>Submission Successful!</h3>
		<ul class="list">
			<!-- <li>
				<span>Ticket ID</span>
				<span>{{orderInfo.shortId||''}}</span>
			</li> -->
			<li>
				<span>Total Stake</span>
				<span>{{orderInfo.totalStake}}</span>
			</li>
			<li v-if="orderInfo.showFavorAmount">
				<!-- 直减红包 -->
				<span v-if="orderInfo.favorType === 1">Cash Gifts</span>
				<span v-else>Discount Gifts</span>
				<em>{{orderInfo.showFavorAmount}}</em>
			</li>
			<li>
				<span>Potential Win</span>
				<span>{{orderInfo.potentialWinnings}}</span>
			</li>
			<li v-if="orderInfo.shareCode" class="share-code">
				<span @click="showTips">Booking Code<em></em></span>
				<span>{{orderInfo.shareCode}}<i v-if="isHaveCopy" ref="copyShareCode" :data-clipboard-text="orderInfo.shareCode">Copy</i></span>
			</li>
		</ul>
		<p class="cashout-top" v-if="orderInfo.showFavorAmount">Note: Cashout unavailable as Gifts have been used.</p>
		<div class="btn-box">
			<span class="btn" @click="close">OK</span>
		</div>
		<div class="btn-box rebet" v-if="orderInfo.shareCode">
			<span class="btn" @click="goToShare">Rebet</span>
		</div>
		<div class="jump-box">
			<a :href="`${betHistoryUrl}?isSettled=10`">Check Bet History</a><i></i>
		</div>
		<a :href="ads.linkUrl" v-if="ads && ads.imgUrl && ads.linkUrl" class="bottomImg">
			<img :src="ads.imgUrl">
		</a>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { getAdConfig } from 'utils/getAdConfig';
import { TOGGLE_RIGHT } from 'store/layout/mutationTypes';
import { UPDATE_ORDER_INFO } from 'store/betslipStake/mutationTypes';
import { pagePath } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import ClipboardJS from 'clipboard';
import { EventBus } from 'kernel/js/eventBus';
import cashoutEvent from 'config/cashout/eventCfg';

export default {
	name: 'successDialog',
	data() {
		return {
			betHistoryUrl: userCenterUrl.sportOrder,
			isHaveCopy: document.execCommand,
			ads: {}
		};
	},
	watch: {
		// 直接关闭右边
		showRight (val) {
			if (!val && this.orderInfo) {
				this[UPDATE_ORDER_INFO](null);
			}
		}
	},
	computed: {
		...mapState('betslipStake', ['orderInfo']),
		...mapState('layout', ['showRight'])
	},
	created () {
		EventBus.$emit(cashoutEvent.UPDATE_CASHOUT_COUNT);
		this.getAd();
	},
	mounted () {
		if (this.$refs.copyShareCode) {
			this.clipboard = new ClipboardJS(this.$refs.copyShareCode);
			this.clipboard.on('success', e => {
				this.$toast('Successfully copied');
				e.clearSelection();
			});
		}
	},
	beforeDestroy () {
		if (this.clipboard) {
			this.clipboard.destroy();
		}
	},
	methods: {
		...mapMutations('layout', [TOGGLE_RIGHT]),
		...mapMutations('betslipStake', [UPDATE_ORDER_INFO]),
		close() {
			this[UPDATE_ORDER_INFO](null);
			this.toggleRight(false);
		},
		async getAd () {
			const ads = await getAdConfig('orderSuccess');
			this.ads = ads[0] || {};
		},
		showTips () {
			this.$alert('Input this code in betslip to restore selections.');
		},
		goToShare () {
			location.href = URL.addPara(pagePath.home, {
				shareCode: this.orderInfo.shareCode
			});
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import '~base/styles/icon.less';

.success-dialog {
	background: @white;
	width: 100%;
	height: 100%;
	display: block;
	position: absolute;
	padding-top: 66/@rem;
	z-index: 49;
	top: 0;
	left: 0;
	color: @dark;
	z-index:333;
	overflow: auto;
	.title {
		text-align: center;
		font-size: 20/@rem;
		line-height: 22/@rem;
		padding-bottom: 36/@rem;
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
		margin: 0 10/@rem;
		border-top: 5/@rem solid @fogGray;
		border-bottom: 1px solid @fogGray;
		padding: 10/@rem 0;
		li {
			line-height: 26/@rem;
			min-height: 26/@rem;
			font-size: 14/@rem;
			display: flex;
			span {
				flex: 1 0 0%;
				display: block;
				&:last-child{
					text-align: right;
				}
				&:first-child{
					color: @darkGray;
				}
			}
			&.share-code{
				i{
					color: @linkBlue;
					font-size: 10/@rem;
					width: 48/@rem;
					height: 20/@rem;
					line-height: 20/@rem;
					text-align: center;
					border-radius: 2px;
					border: solid 1px @fogGrayBorder;
					vertical-align: middle;
					margin-left: 7/@rem;
					display: inline-block;
				}
				em{
					.m-icon-tips();
					&:before{
						padding-left: 5/@rem;
						color: @darkGray;
					}
				}
			}
		}
	}
	.cashout-top{
		font-size: 10/@rem;
		color: @darkGray;
		padding: 8/@rem 16/@rem 0;
	}
	.btn{
		margin: 0 10/@rem;
		margin-top: 38/@rem;
		text-align: center;
		background-color: @green;
		display: block;
		height: 48/@rem;
		line-height: 48/@rem;
		font-size: 16/@rem;
		color: @white;
		border-radius: 2/@rem;
	}
	.rebet {
		.btn{
			margin-top: 10/@rem;
			border: 1px solid @green;
			background-color: @white;
			color: @green;
		}
	}
	.jump-box{
		margin-top: 36/@rem;
		text-align: center;
		a{
			display: inline-block;
			&:hover,&,&:visited,&:link, &:active{
				color: @green;
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
				color: @green;
			}
		}
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
