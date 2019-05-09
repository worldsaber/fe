<template>
	<div class="deposit-reg-success">
		<SportyHeader />
		<div class="deposit-success-back">
			<div class="deposit-success-congratulation">Congratulations!</div>
			<div class="deposit-success-gifts">{{currency}}
				<span class="deposit-success-gifts-number">{{gifts}}</span> Gifts
			</div>
			<div class="deposit-success-gifts">is Now Yours!</div>
		</div>
		<div class="deposit-success-account-title">Mobile Number Registered</div>
		<div class="deposit-success-account-number">{{accountNumber}}</div>
		<a class="deposit-success-btn deposit-success-view-gifts" :href="viewGiftsUrl">View My Gifts</a>
		<a class="deposit-success-btn deposit-success-download-app" :href="downloadUrl">Download App</a>
		<div class="deposit-success-list">
			<a class="deposit-success-item" :href="item.url" v-for="(item, index) in list" :key="index">
				<span :class="['deposit-item-icon', item.icon]"></span>
				<span>{{item.label}}</span>
			</a>
		</div>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import SportyHeader from 'components/depositReg/header.vue';
import cookie from 'storage/cookie';
import { formatNumber } from 'utils';

export default {
	components: {
		SportyHeader,
	},
	data() {
		return {
			currency: window.currency,
			viewGiftsUrl: `${pagePath.gifts}?source=fbad`,
			downloadUrl: `${pagePath.downloadApp}?source=fbad`,
			list: [{
				label: 'Today\'s Football',
				icon: 'm-icon--football',
				url: `${pagePath.preFootball}today?source=fbad`
			}, {
				label: 'Live',
				icon: 'm-icon--live',
				url: `${pagePath.liveList}?source=fbad`
			}, {
				label: 'Virtual',
				icon: 'm-icon-virtual',
				url: `${pagePath.virtual}?source=fbad`
			}, {
				label: 'Jackpot',
				icon: 'm-icon-jackpot',
				url: `${pagePath.jackpot}?source=fbad`
			}],
			accountNumber: '',
			gifts: ''
		};
	},
	created() {
		this.accountNumber = cookie('phone');
		const query = this.$route.query;
		this.gifts = formatNumber(query.gifts);
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.deposit-reg-success{
	color: #1b1e25;
	text-align: center;
}
.deposit-success-back{
	background: url('../images/success-back.png') no-repeat;
	background-size: 100% ;
}
.deposit-success-congratulation{
	padding: 50/@rem 0 10/@rem;
	font-size: 14/@rem;
	font-weight: bold;
}
.deposit-success-gifts{
	font-size: 26/@rem;
	font-weight: bold;
}
.deposit-success-gifts-number{
	color: #0d9737;
}
.deposit-success-account-title{
	font-size: 16/@rem;
	color: #9ca0ab;
	margin-top: 35/@rem;

}
.deposit-success-account-number{
	font-size: 16/@rem;
	color: #353a45;
}
.deposit-success-btn {
	display: block;
	height: 48/@rem;
	line-height: 48/@rem;
	margin: 16/@rem 20/@rem;
	font-size: 16/@rem;
	font-weight: bold;
	border-radius: 2/@rem;
}
.deposit-success-view-gifts{
	background-color: #0d9737;
	color: #FFF;
}
.deposit-success-download-app{
	background-color: #FFF;
	color: #0d9737;
	border: 1px solid #0d9737;
}
.deposit-success-list{
	display: flex;
	margin: 100/@rem 16/@rem 0;
}
.deposit-success-item{
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	flex: 1;
	padding: 10/@rem 20/@rem 5/@rem;
	font-size: 10/@rem;
	color: #000;

	.m-icon--football{
		.m-icon--football();
	}
	.m-icon--live{
		.m-icon-tv();
	}
	.m-icon-virtual{
		.m-icon-virtual();
	}
	.m-icon-jackpot{
		.m-icon-jackpot();
	}
	.deposit-item-icon{
		width: 24/@rem;
		height: 24/@rem;
		margin-bottom: 5/@rem;
		&::before{
			font-size: 24/@rem;
			line-height: 24/@rem;
		}
	}
}
</style>
