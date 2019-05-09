<template>
	<div class="green-bg-wrap">
		<a :href="homeUrl" class="deposit-reg-home-link"></a>
		<Timer class="deposit-reg-timer" :timeout="timeout" :percent="percent"/>
		<Picker v-model="value" :data="list" class="deposit-picker-list"/>
		<!-- <Register @success="onRegisterSuccess" :btnLabel="btnLabel"/> -->
		<div class="deposit-reg-btn" @click="onRegisterSuccess">{{btnLabel}}</div>
	</div>
</template>
<script>
import succ from 'statistics/succ';
import { pagePath } from 'config/pageConfig';
import Picker from './picker.vue';
import Timer from './timer.vue';
// import Register from './register.vue';

export default {
	components: {
		Picker,
		Timer,
		// Register,
	},
	data() {
		return {
			timeout: 0,
			percent: 0,
			width: '180px',
			value: 0, // 选中的数组索引
			list: [],
		};
	},
	computed: {
		greenBorderStyle() {
			return {
				borderLeft: `${this.width} solid transparent`,
				borderRight: `${this.width} solid #FFF`
			};
		},
		selectedPackage() {
			return this.list[this.value] || {};
		},
		btnLabel() {
			// if (window.countryCode === '234') {
			// 	return 'Register to Get Deal';
			// }
			return `Deposit ${this.selectedPackage.depositAmount / 10000 || ''} to Get Deal `;
		},
		homeUrl() {
			return pagePath.home;
		}
	},
	mounted() {
		this.width = `${document.body.offsetWidth / 2}px`;
	},
	created() {
		this.getConfig();
	},
	methods: {
		getConfig() {
			return fetch('/marketing/v1/activities/firstDeposit/info', {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					const data = res.data;
					this.list = data.infos;
					this.value = data.defaultIndex;
					this.timeout = data.countdown;
					this.percent = data.percent;
				}
			});
		},
		onRegisterSuccess() {
			this.$emit('success', {
				// phone: payload.phone,	// 手机号
				amount: this.selectedPackage.depositAmount / 10000,  // 充值金额
				gifts: this.selectedPackage.giftAmount / 10000, 	// 奖励
			});
			succ();
		}
	},
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.green-bg-wrap {
	position: relative;
	background-image: url('./image/bg.png');
	background-size: cover;
	background-repeat: no-repeat;
	background-position: top;
	padding-top: 54/@rem;
	padding-bottom: 10/@rem;
	.deposit-reg-home-link{
		display: block;
		width: 180/@rem;
		height: 40/@rem;
		margin: -40/@rem auto 0;
	}
	.deposit-reg-timer {
		margin: 12/@rem 0 12/@rem;
	}
	.deposit-reg-btn{
		margin: 20/@rem 30/@rem 10/@rem;
		height: 48/@rem;
		line-height: 48/@rem;
		background-color: #33ea6a;
		color: #1b1e25;
		font-size: 16/@rem;
		text-align: center;
		border-radius: 2/@rem;
	}
}
</style>
