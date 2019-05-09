<template>
	<div class="m-market-title" @click="$emit('isShow', !isShow)" v-if="market">
		<span :class="['dis-icon', {
			hide: !isShow
		}]"></span>
		<span class="text">{{marketTitle}}</span>
		<span class="m-icon-tips" @click.stop="showMarketGuide"></span>
		<a :href="oddsBoostUrl" v-if="isBoost"><img class="boost" src="../image/boost-icon.svg" /></a>
		<span class="market-right-wrap">
			<span :class="['market-favor', isFavor ? 'market-favor-able': 'market-favor-disable']" @click.stop="favorMarket"></span>
		</span>
	</div>
</template>

<script>
/**
 * marketTitle的显示，目前所有的market的title显示都是一样的
 */
import { mapActions, mapState } from 'vuex';
import { oddsBoostActivity } from 'config/activity/activityConfig';
import { loginPromise } from 'components/login/tools';

export default {
	model: {
		prop: 'isShow',
		event: 'isShow'
	},
	props: {
		market: {
			type: Object
		},
		isShow: {
			type: Boolean,
			'default': true
		},
		isBoost: {
			type: Boolean,
			'default': true
		}
	},
	data () {
		return {
			oddsBoostUrl: oddsBoostActivity
		};
	},
	computed: {
		...mapState('eventDetail', ['event', 'favorMarketIds']),
		marketTitle () {
			return this.market.desc;
		},
		// favor与specifier无关
		isFavor () {
			const id = +this.market.id;
			if (this.favorMarketIds && this.favorMarketIds.length) {
				return this.favorMarketIds.some(fid => fid === id);
			}
			return false;
		}
	},
	methods: {
		...mapActions('eventDetail', [
			'fetchFavorMarketIds',
			'toggleMarketFavor',
		]),
		showMarketGuide () {
			if (this.market.marketGuide) {
				this.$alert(this.market.marketGuide);
			}
		},
		favorMarket () {
			const params = {
				status: this.isFavor,
				sportId: this.event.sportId,
				productId: this.market.product,
				marketId: +this.market.id
			};
			const isLogin = window.loginStatus;

			// 上传数据
			loginPromise()
			.then(() => {
				// 登录状态变化后，主动拉取一下favorMarketIds
				if (!isLogin) {
					this.fetchFavorMarketIds({
						sportId: this.event.sportId,
						productId: this.market.product,
					});
				}
				this.toggleMarketFavor(params)
				.then(message => {
					message && this.$toast(message, 1000);
				})
				.catch(res => {
					if (res.login === false) {
						this.favorMarket();
					}
				});
			});
		},
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';
.m-market-title{
	display: flex;
	overflow: hidden;
	padding-right: 28/@rem;
	color: @dark;
	font-size: 14/@rem;
	border-radius: 2/@rem;
	min-height: 40/@rem;
	align-items: center;
	padding-left: 10/@rem;
	user-select: none;
	box-sizing: border-box;
	position: relative;
	border-top: 1px solid @fogGray;
	.text{
		display: inline-block;
		padding-left: 10/@rem;
		max-width: 64%;
	}
	.boost{
		flex-shrink: 0;
		width: 24/@rem;
		height: 24/@rem;
		margin-left: 4/@rem;
	}
	.dis-icon{
		display: inline-block;
		&:after{
			content: '\e6a3';
			font-family: "iconfont" !important;
			font-size: 10/@rem;
			font-style: normal;
			display: inline-block;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			line-height: 1.4;
			height: 14/@rem;
			overflow: hidden;
			vertical-align: middle;
			color: @midGreen;
		}
		&.hide{
			transform: rotate(-90deg);
		}
	}
	.m-icon--pri{
		text-align: center;
		.m-icon--priority();
		height: 18/@rem;
		width: 18/@rem;
		line-height: 18/@rem;
		border-radius: 1px;
		color: @dark;
		background: @midGreen;
		&::before{
			font-size: 12/@rem;
			vertical-align: super;
		}
	}
	.m-icon-priority{
		height: 18/@rem;
		width: 18/@rem;
	}
	.market-right-wrap{
		flex: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		text-align: right;
	}
	.market-favor{
		cursor: pointer;
		width: 20/@rem;
		height: 20/@rem;
		padding: 5/@rem;
		background: center center no-repeat;
		background-size: 20/@rem 20/@rem;
		&.market-favor-able{
			background-image: url('../image/favored.svg');
		}
		&.market-favor-disable{
			background-image: url('../image/unfavor.svg');
		}
	}

	.m-icon-tips {
		margin-left: 8/@rem;
		color: @darkGray;
		.m-icon-tips();
		color: #9ca0ab;
	}
}
</style>
