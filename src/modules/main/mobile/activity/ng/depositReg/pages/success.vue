<template>
	<div class="deposit-reg-success-wrap">
		<SportyHeader class="reg-header"/>
		<div class="success-title" v-if="source != 'login'">
			<span class="success-icon"></span>
			Successfully Registered!
		</div>
		<div class="success-content">You're one step away from </div>
		<div class="success-content">NGN {{giftsNumber}} Gifts!</div>
		<a class="success-deposit-btn" :href="depositUrl">Deposit {{amount}}</a>
		<div class="success-deposit-gifts">You'll get NGN {{giftsNumber}} OFF in total when placing bets at SportyBet!</div>
		<div class="success-footer">Not Now,
			<a :href="downloadUrl">Download App</a> or
			<a :href="webUrl">Go To Website</a>
		</div>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import SportyHeader from 'components/depositReg/header.vue';
import { formatNumber } from 'utils';

export default {
	components: {
		SportyHeader,
	},
	data() {
		return {
			downloadUrl: `${pagePath.downloadApp}?source=fbad`,
			webUrl: `${pagePath.home}?source=fbad`,
			amount: 0,
			gifts: 0,
			source: ''
		};
	},
	computed: {
		depositUrl() {
			return `${pagePath.myCenter}/deposit?source=fbad&amount=${this.amount}`;
		},
		giftsNumber() {
			return formatNumber(this.gifts);
		}
	},
	created() {
		const query = this.$route.query;
		this.amount = query.amount;
		this.gifts = query.gifts;
		this.source = query.source;
	}

};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.deposit-reg-success-wrap{
	color: #1b1e25;
	.reg-header{
		margin-bottom: 45/@rem;
	}
	.success-title{
		margin: 35/@rem 0 30/@rem;
		font-size: 14/@rem;
		font-weight: bold;
		text-align: center;
	}
	.success-icon{
		display: inline-block;
		width: 24/@rem;
		height: 24/@rem;
		border-radius: 12/@rem;
		margin-right: 10/@rem;
		background-color: #2FC84F;
		.m-icon-success();
		&::before{
			font-size: 12/@rem;
			line-height: 24/@rem;
			color: #0d9737;
		}
	}
	.success-content{
		font-size: 22/@rem;
		font-weight: bold;
		text-align: center;
	}
	.success-deposit-btn{
		display: block;
		margin: 26/@rem 16/@rem 20/@rem;
		color: #FFF;
		height: 48/@rem;
		line-height: 48/@rem;
		background-color: #0d9737;
		text-align: center;
		font-size: 16/@rem;
		font-weight: bold;
		border-radius: 2/@rem;

	}
	.success-deposit-gifts{
		position: relative;
		margin: 20/@rem;
		font-size: 14/@rem;
		padding-left: 28/@rem;
		.m-icon-light2();
		&::before{
			position: absolute;
			left: 0;
			font-size: 20/@rem;
			color: #0d9737;
		}
	}
	.success-footer{
		font-size: 14/@rem;
		margin: 210/@rem 0 40/@rem;
		text-align: center;

	}

}
</style>
