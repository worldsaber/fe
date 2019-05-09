<template>
	<div class="green-bg-wrap">
		<a :href="homeUrl" class="deposit-reg-home-link"></a>
		<Timer class="deposit-reg-timer" :timeout="timeout" :percent="percent"/>
		<Picker v-model="value" :data="list" class="deposit-picker-list"/>
		<div class="deposit-reg-btn" @click="checkThenDeposit" v-if="isLogin">{{btnLabel}}</div>
		<Register @success="onRegisterSuccess" :btnLabel="btnLabel" v-else/>
	</div>
</template>
<script>
import succ from 'statistics/succ';
import { pagePath } from 'config/pageConfig';
// import dialog from 'components/dialog';
import Picker from './picker.vue';
import Timer from './timer.vue';
import Register from './register.vue';
import { shopDialog, checkFirstDeposit } from './util.js';

export default {
	components: {
		Picker,
		Timer,
		Register,
	},
	data() {
		return {
			timeout: 0,
			percent: 0,
			width: '180px',
			value: 0, // 选中的数组索引
			list: [],
			isLogin: window.loginStatus,
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
		async checkThenDeposit() {
			const isAllow = await checkFirstDeposit();
			if (isAllow) {
				this.onRegisterSuccess({ source: 'login' });
			} else {
				// 不具备首充资格
				shopDialog();
			}
		},
		onRegisterSuccess(payload) {
			this.$emit('success', {
				...payload,
				// phone: payload && payload.phone,	// 手机号
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
	padding-bottom: 30/@rem;
	.deposit-reg-home-link{
		display: block;
		width: 180/@rem;
		height: 40/@rem;
		margin: -40/@rem auto 0;
	}
	.deposit-reg-timer {
		margin: 12/@rem 0 12/@rem;
	}
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
.m-fm-dialog-first-deposit.es-dialog{
	.es-dialog-head h1{
		font-size: 16/@rem;
		height: auto;
	}
	.es-dialog-close{
		display: block;
		padding: 5/@rem;
		em:before{
			font-size: 12/@rem;
		}
	}
	.es-dialog-main{
		font-size: 16/@rem;
		color: #353a45;
	}
	.es-dialog-footer{
		display: flex;
		justify-content: center;
		padding: 30/@rem 15/@rem 20/@rem;
		text-align: left;
	}
	.es-dialog-btn{
		width: 100/@rem;
		padding: 0 5/@rem;
		font-size: 14/@rem;
		border-radius: 2/@rem;
		background-color: #0d9737;
		border: 1px solid #0d9737;
		color: #FFF;
		&:first-of-type {
			// width: 90/@rem;
			color: #0d9737;
			border: 1px solid #0d9737;
			background-color: #FFF;
			margin-right: 10/@rem;
		}
	}

}
</style>
