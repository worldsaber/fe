<template>
<Layout :isHaveBottomNav="false" :isHaveLoading="false" :isHasFooter="false">
	<div class="m-load-code" slot="mid">
		<NavBar :router="{ name: 'home' }"></NavBar>

		<div class="m-main-info">
			<LightForm
				class="m-load-code-form"
				placeholder="Booking Code"
				btnText="Load"
				ref="lightForm"
				:validate="validate"
				@submit="handleSubmit">
				<div class="m-desc" slot='desc'>A booking code enables you to book a bet. Odds or availabilities may change.</div>
			</LightForm>

			<div class="m-desc-wrap">
				<h3>How to get a booking code?</h3>
				<ul>
					<li v-for="(item, index) in steps" :key="index">
						<div class="m-label">Step{{index}}</div>
						<div>{{item}}</div>
					</li>
				</ul>
				<div class="m-img-container">
					<img src="./images/book-bet-ke.png" v-if="country === 'ke'">
					<img src="./images/book-bet.png" v-else>
				</div>
			</div>
		</div>
	</div>
</Layout>
</template>

<script>
import { mapActions } from 'vuex';
import Layout from 'components/layout/main.vue';
import NavBar from 'components/navbar/index.vue';
import LightForm from 'components/lightForm';

// ke
const keSteps = [
	'Go to our website / app',
	'Make the selections you want to bet on',
	'Click on the "Share Betslip" button on website/app'
];

// ng, gh
const defaultSteps = [
	'Go to our website / mobile web / app',
	'Make the selections you want to bet on',
	'Click on the “Book bet” button on web website/mobile web/app'
];

// 这里默认采用 ng
const country = window.country || 'ng';

export default {
	name: 'LoadCode',
	components: {
		Layout,
		NavBar,
		LightForm
	},
	data() {
		return {
			country,
			steps: country === 'ke' ? keSteps : defaultSteps
		};
	},
	methods: {
		...mapActions('betslip', ['loadBetslip']),
		validate (inputValue) {
			if (!inputValue) {
				return 'The code is required.';
			}
		},
		async handleSubmit (betCode) {
			const lightFormVm = this.$refs.lightForm;
			if (!navigator.onLine) {
				this.$nextTick(() => lightFormVm.$emit('stopLoading'));
				return this.$toast('Network connection error');
			}
			try {
				await this.loadBetslip({ betCode });
				this.$router.push({ name: 'home', params: { showBetslip: true }});
			} catch (msg) {
				lightFormVm.$emit('error', msg);
			}
			lightFormVm.$emit('stopLoading');
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.m-main-info {
	padding: 20/@rem 16/@rem;
}

.m-desc-wrap {
	margin-top: 56/@rem;
	color: @dark;

	h3 {
		font-size: 18/@rem;
	  	font-weight: normal;
	  	line-height: 1;
	}

	ul {
		margin-top: 20/@rem;

		li {
			font-size: 12/@rem;
			line-height: 14/@rem;
			position: relative;
			padding-left: 40/@rem;
			margin-bottom: 16/@rem;

			.m-label {
				font-weight: bold;
				position: absolute;
				left: 0;
			}
		}
	}

	.m-img-container {
		margin-top: 30/@rem;
		text-align: center;
		vertical-align: top;

		img {
			width: 164/@rem;
		}
	}
}
</style>
