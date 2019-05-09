<template>
	<div class="container m-redeem">
		<topNavBar backText="Back" id="top-navbar" :backClick="handleBack"/>
		<div class="wrapper">
			<LightForm
				class="m-gift-code-wrap"
				placeholder="Enter Your Gift Code"
				btnText="Redeem"
				ref="lightForm"
				:validate="validate"
				@submit="ajaxPost">

				<section slot="desc">
					<p class="situation">The “Gift Code” area is only to be used when a Gift Code is given to a customer by the SportyBet Team.</p>
					<p class="all">Gift Codes are not related to promotions. If you believe you are missing a Gift, we highly recommend you to contact our Customer Service using our Live Chat.</p>
				</section>
			</LightForm>
		</div>
	</div>
</template>


<script>
import topNavBar from 'components/navbar/index.vue';
import LightForm from 'components/lightForm';
import { pagePath } from 'config/pageConfig';
import popMsg from '../deposit/ke/js/popMsg';

import '../mockData/gifts/index?debug';

export default {
	mixins: [popMsg],
	components: {
		topNavBar,
		LightForm
	},
	data () {
		return {
			gifts: `${pagePath.myCenter}/gifts`
		};
	},
	methods: {
		handleBack () {
			location.href = this.gifts;
		},
		// 表单验证
		validate (code) {
			if (code === '') {
				return 'Gift code is required.';
			}
		},
		handleLogin() {
			if (this.$popupLogin) {
				this.$popupLogin.show();
			} else {
				location.href = `${pagePath.login}?okUrl=${encodeURIComponent(location.href)}`;
			}
		},
		// submit button click
		ajaxPost (redeemCode) {
			const lightFormVm = this.$refs.lightForm;

			// 未登录
			if (!window.loginStatus) {
				this.handleLogin();
				lightFormVm.$emit('stopLoading');
				return false;
			}

			fetch('/promotion/v1/gifts/redeem', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					redeemCode
				})
			})
			.then(res => res.json())
			.then(data => {
				lightFormVm.$emit('stopLoading');

				if (data.login === false) {
					return this.handleLogin();
				}

				const bizCode = (data || {}).bizCode;
				// 兑换成功
				if (bizCode === 10000) {
					this.showToast('Gift code was applied successfully.');
					lightFormVm.$emit('success');
				} else if (bizCode === 73100) {
					lightFormVm.$emit('error', 'This code has already been redeemed.');
				} else if (bizCode === 73300) {
					this.showMsgPop({
						msg: 'You have attempted too many times, please try later'
					});
				} else {
					lightFormVm.$emit('error', 'Invalid Gift. Gift code cannot be found.');
				}
			}).catch(() => {
				lightFormVm.$emit('stopLoading');
				this.showToast('No internet connection, try again.');
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import '../deposit/ke/style/button.less';
@import '../deposit/ke/style/input.less';
.wrapper {
	padding: 20/@rem 16/@rem;
}

.m-redeem {
	.m-gift-code-wrap {
		section {
			p {
				margin-bottom:22/@rem;

				&:last-child {
					margin-bottom: 0
				}
			}
		}
	}
}
</style>
