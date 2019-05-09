<template>
<div class="plan8-wrapper">
	<Market @toReg="toReg" v-if="step==='pickMarket'"/>
	<ActivityReg @regSuccess="regSuccess" :topImg="topImg" v-if="step==='reg'">
		<div slot="topContent" class="content">
			<p><i/>You Selected "{{pickedDesc}}" to win the match and your Potential Winnings are {{currency}} {{potentialWin}}!</p>
			<h1 class="title">Last Step - Registration</h1>
		</div>
	</ActivityReg>
	<BetStatus v-if="step==='betStatus'"/>
</div>
</template>
<script>
import { URL } from 'utils';
import ActivityReg from 'components/activityReg';
import 'statistics/tj';
import succ from 'statistics/succ';
import { mapActions, mapState } from 'vuex';
import Market from 'components/activityReg/sportyCoins/market';
import BetStatus from 'components/activityReg/sportyCoins/betStatus';

export default {
	props: ['topImg'],
	data () {
		return {
			planId: 1,
			// 如果为空组件内部取默认,
			step: 'pickMarket',
			currency: window.currency
		};
	},
	computed: {
		...mapState('activityRegister', [
			'potentialWin',
			'pickedDesc'
		]),
	},
	components: {
		ActivityReg,
		Market,
		BetStatus
	},
	created () {
		this.planId = +URL.getPara('planId') || 1;
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
	methods: {
		...mapActions('activityRegister', [
			'checkCoins'
		]),
		toReg() {
			this.step = 'reg';
		},
		regSuccess() { // 注册成功后页面进入loading，去拿coin，拿到coin后调生单接口，跳转生单状态页，
			document.querySelector('#pageLoading').style.display = 'block';
			succ();
			this.checkCoins();
			this.step = 'betStatus';
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
@import 'base/styles/icon.less';

	.plan8-wrapper {
		
		.m-page-opt {
			margin-bottom: 48/@rem;
		}
		.m-logo-wrapper, .m-page-back {
			display: none;
		}
		.af-button {
			margin-top: 30/@rem;
			margin-bottom: 30/@rem;
		}
		.content {
			p {
				margin-top: 21/@rem;
				margin-bottom: 20/@rem;
				color: #4a4a4a;
				line-height: 1.5;
				i {
					.m-icon-light2();
					&:before {
						color: @green;
						font-size: 16/@rem;
						margin-right: 7/@rem;
					}
				}
			}
			h1 {
				font-size: 14/@rem;
				font-weight: 500;
				line-height: 0.94;
				text-align: center;
			}
		}
	}
</style>
