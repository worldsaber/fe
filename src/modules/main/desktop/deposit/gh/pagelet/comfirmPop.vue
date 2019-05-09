<template lang="html">
	<div class="m-dialog-wrapper m-dp-pop--tips">
		<div class="m-pop-header">
			<span>Already Completed?</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
				@click="submit"
			></i>
		</div>
		<div class="m-pop-main">
			<p>Online deposit has been initiated on your phone. Please follow instructions on the prompt to complete deposit. If you already done, tap on the "Completed" button to confirm.</p>
			<div class="m-btn-wrapper">
				<af-button
					extraType="primary"
					@click="submit"
					:loading="loading"
				>{{subText}}</af-button>
				<af-button
					extraType="text"
					@click="submit"
					data-action="close"
					data-ret="close"
				>Cancel</af-button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import 'packages/button';
import pageMixin from '../js/pageMixin';

export default {
	mixins: [
		pageMixin
	],
	computed: {
		subText() {
			return this.loading ? 'Loading...' : 'Completed';
		},
	},
	methods: {
		...mapActions('deposit', [
			'queryInfo'
		]),
		submit() {
			if (this.loading) {
				return;
			}

			this.loading = true;
			this.queryInfo();
		}
	}
};
</script>
