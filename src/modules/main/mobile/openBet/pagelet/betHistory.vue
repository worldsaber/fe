<template lang="html">
	<div class="m-bethistory">

		<div class="m-error-wrapper" v-if="!isLogin">
			<div>
				<span class="m-error-msg">Please Log In to see your Bet History</span>
				<div class="m-btn" @click="login">Log In</div>
			</div>
		</div>

		<router-view v-else></router-view>

		<AdBanner keyword="openBetsFooter" v-if="!isLogin" />
	</div>
</template>

<script>
import { mapState } from 'vuex';

import PageComMixin from '../js/commonMixin';

export default {
	mixins: [
		PageComMixin
	],
	computed: {
		...mapState('openBet', [
			'isLogin'
		])
	}
};
</script>

<style lang="less">
@import '../style/betHistory.less';
</style>
