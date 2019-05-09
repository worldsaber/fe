<template lang="html">
	<div class="m-shop-confirm">
		<div class="m-l-top">
			<h3>Confirm to Pay</h3>
			<div>{{showCurrency}}{{showPrice}}</div>
		</div>
		<div class="m-l-bottom">
			<af-button
				extraType="cancel"
				:autofocus="false"
				@click.stop="closePop"
			>Cancel</af-button>
			<af-button
				extraType="sure"
				:autofocus="false"
				:loading="loading"
				@click.stop="pay"
			>{{subText}}</af-button>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import 'packages/button';
import { showCurrency } from 'config/currencyConfig';
import 'components/login/popupLogin';
import { formatNumber } from 'utils';

export default {
	data() {
		return {
			showCurrency,
			loading: false
		};
	},
	computed: {
		...mapState('shop', [
			'reqLoading'
		]),
		...mapState('assetsInfo', [
			'balance'
		]),
		subText() {
			return this.loading ? 'Loading...' : 'Confirm';
		},
		showPrice() {
			return formatNumber(this.contentData.showPrice, 2);
		}
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.loading = false;
			}
		}
	},
	methods: {
		...mapActions('shop', [
			'purchase'
		]),
		closePop() {
			if (this.loading) {
				return;
			}

			this.$parent.close();
		},
		pay() {
			if (!window.loginStatus) {
				this.$dialog();
				this.$popupLogin.show();
				return;
			}

			if (this.balance < this.contentData.showPrice) {
				this.$toast('Your balance is insufficient.');
				return;
			}

			if (this.loading) {
				return;
			}

			this.loading = true;
			this.purchase(this.contentData.id || '').catch(() => {});
		}
	}
};
</script>

<style lang="less">
@import '../style/confirm.less';
</style>
