<template lang="html">
	<div class="m-cashout-error">
		<div v-if="isLoading">
			<i class="m-icon-load"></i>
			<p class="m-text-msg">Loading…</p>
		</div>

		<!-- 加载cashout列表失败 -->
		<div v-else-if="isLoadError">
			<p class="m-text-msg">Data failed loading. Please reload.</p>
			<af-Button
				extraType='text'
				@click="reload"
			>Reload</af-Button>
		</div>

		<!-- 没有cashout列表 -->
		<div v-else-if="isEmpty">
			<p class="m-text-msg">No bets available</p>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import 'packages/button';

export default {
	name: 'EmptyPage',

	props: {
		isEmpty: {
			type: Boolean,
			'default': false
		},
		isLoadError: {
			type: Boolean,
			'default': false
		},
		isLoading: {
			type: Boolean,
			'default': false
		}
	},
	methods: {
		...mapActions('cashout', {
			getCashoutList: 'fetchCashoutList'
		}),
		reload() {
			this.getCashoutList();
		}
	}
};
</script>

<style lang="css">
</style>
