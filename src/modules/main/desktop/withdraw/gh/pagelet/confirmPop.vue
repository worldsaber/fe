<template lang="html">
	<div class="m-dialog-wrapper">
		<div class="m-pop-header">
			<span>{{infos.title || ""}}</span>
			<i
				class="m-icon-close"
				@click="handleCancel"
			></i>
		</div>
		<div class="m-pop-main">
			<p>{{infos.msg || ""}}</p>
			<div class="m-btn-wrapper">
				<af-Button
					extraType="text"
					@click="handleCancel"
				>Cancel</af-Button>
				<af-Button
					:loading="loading"
					@click="handleContinue"
				>Continue</af-Button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import 'packages/button';

import pageMixin from '../js/pageMixin';

export default {
	name: 'confirmPop',

	mixins: [pageMixin],

	data() {
		return {
			infos: {}
		};
	},

	computed: {
		...mapState('withdraw', [
			'errorInfo'
		]),
		getCodeText() {
			if (this.loading) {
				return ' Loading...';
			}

			return 'Continue';
		},
	},
	methods: {
		...mapActions('withdraw', [
			'withdraw'
		]),
		handleContinue() {
			if (this.loading) {
				return;
			}

			this.loading = true;
			this.withdraw();
		},
		handleCancel() {
			if (this.loading) {
				return;
			}

			window.location.reload();
		}
	},
	mounted() {
		this.infos = this.errorInfo || {};
	}
};
</script>
<style media="screen" lang="less">
@import 'components/popDialog/style/commonPop.less';

.m-dialog-wrapper {

	.af-button {

		width: 120px;
		vertical-align: top;
	}
}
</style>
