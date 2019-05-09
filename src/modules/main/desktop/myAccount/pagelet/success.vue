<template>
		<div class="m-fm-sucwrap">
			<h2><i class="m-icon--success"></i>Password Changed</h2>
			<p>Your new password has been set successfully.</p>
			<div class="m-btn-wrap" style="width:198px;margin:60px auto 16px;">
				<AfButton
							type="primary"
							@click="goUrl"
							>Continue Betting</AfButton>
			</div>
		</div>
</template>

<script>
import { userCenterUrl } from 'config/order/userCenterConfig';
import AfButton from 'packages/button/button.vue';
import { pagePath } from 'config/pageConfig';

export default {
	components: {
		AfButton
	},
	data () {
		return {
			transactionUrl: userCenterUrl[5]
		};
	},
	methods: {
		goUrl () {
			window.location.href = pagePath.home;
		}
	}
};
</script>
